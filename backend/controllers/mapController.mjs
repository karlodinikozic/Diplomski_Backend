import { query } from "express";
import {
  validateFilterBody,
  validateRangeFilter,
} from "../middleware/mapValidations.mjs";
import { User } from "../models/User.mjs";
import { default as _ } from "lodash";

class QueryClass {
  constructor() {}
}

export const usersOnMap = async (req, res, next) => {
  try {
    //VALIDATE BODY
    const err = validateRangeFilter(req.query);
    if (err) {
      return res.status(400).send({ message: `Invalid request ${err}` });
    }

    const { range } = req.query;
    const query = User.find(); // ADD FILLTERS

    const user = await User.findById({ _id: req.user_id });
    const result = await query.circle("lastKnownLocation", {
      center: user.lastKnownLocation.coordinates,
      radius: range / 6378.1,
      spherical: true,
    });


    const results_with_distance = calculateDistance(user.lastKnownLocation.coordinates,result)

    return res.status(200).send(results_with_distance);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const filterUsersOnMap = async (req, res, next) => {
  try {
    //VALIDATE BODY
    const err = validateFilterBody(req.body);
    if (err) {
      return res.status(400).send({ message: `Invalid request ${err}` });
    }
    //helper

    let helper = []
    if(! _.isUndefined(req.body.age)){
        helper.push({age:{$gte:req.body.age.min,$lte:req.body.age.max}}) 

    }

    if(! _.isUndefined(req.body.sex)){
        let or= []
        if(req.body.sex == 0){
            or.push({gender:'male'})
        }
        else if(req.body.sex == 1){
            or.push({gender:'female'})
        }
        else{
            or.push({gender:'male'})
            or.push({gender:'female'})
            or.push({gender:'other'})
        }
        helper.push({$or:or})
    }



    if(! _.isUndefined(req.body.interests)){
        let arr = req.body.interests.map(i => i.interest)
        console.log(arr)
        helper.push( {'interests.interest':{$in:[...arr]}})
    }

 

    const query = User.find({
      $and: helper,    
    }); 
    query.setOptions({ lean: true });
    query.collection(User.collection);
    const user = await User.findById({ _id: req.user_id });


    const {range} = req.body
    const result = await query.circle("lastKnownLocation", {
      center: user.lastKnownLocation.coordinates,
      radius: range / 6378.1,
      spherical: true,
    });

    //TODO DISTANCE 

    //REMOVE DISLIKE USERs
    const results_with_distance = calculateDistance(user.lastKnownLocation.coordinates,result)
    return res.status(200).send(results_with_distance.filter(i=>i._id!=req.user_id));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};


const calculateDistance = (userLocation,arrOfPeople)=>{
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  function getDistanceFromLatLonInKm(mk1,mk2) {
   

      var R = 6371; // Radius of the Earth in km
      var rlat1 = mk1[0] * (Math.PI/180); // Convert degrees to radians
      var rlat2 = mk2[0]* (Math.PI/180); // Convert degrees to radians
      var difflat = rlat2-rlat1; // Radian difference (latitudes)
      var difflon = (mk2[1]-mk1[1]) * (Math.PI/180); // Radian difference (longitudes)

      var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
      return d;
  }
  

  const distanceArr = arrOfPeople.map(p=>{
 

    
    let distance =  getDistanceFromLatLonInKm(userLocation,p.lastKnownLocation.coordinates)
   p= p.toObject()
    p.distance= distance
  
    return p
  })


  return distanceArr


}
