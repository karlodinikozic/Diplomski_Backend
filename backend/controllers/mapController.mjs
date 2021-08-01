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

    return res.status(200).send(result);
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
        helper.push({age:{$gt:req.body.age.min,$lt:req.body.age.max}}) 

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
        helper.push( {'interests.interest':{$all:arr}})
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
  
    return res.status(200).send(result.filter(i=>i._id!=req.user_id));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
