// import { query } from "express";
import {
  validateFilterBody,
  validateRangeFilter,
} from "../middleware/mapValidations.mjs";
import { User } from "../models/User.mjs";
import { default as _ } from "lodash";
import { UserPoints } from "../models/UserPoints.mjs";

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

    //TODO FIX RANGE


    const users = await User.find({}) //all
    // const result = await query.circle("lastKnownLocation", {
    //   center: user.lastKnownLocation.coordinates,
    //   radius: range / 6371.1,
    //   spherical: true,
    // });


    const uPoints = (await UserPoints.find({user_id:user._id}))[0]


    const results_with_distance = calculateDistance(
      user.lastKnownLocation.coordinates,
      users
    ).filter(i=> i.distance <= range).filter(el => ! uPoints.dislike.includes(el._id));

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

    let helper = [];
    if (!_.isUndefined(req.body.age)) {
      helper.push({ age: { $gte: req.body.age.min, $lte: req.body.age.max } });
    }

    if (!_.isUndefined(req.body.sex)) {
      let or = [];
      if (req.body.sex == 0) {
        or.push({ gender: "male" });
      } else if (req.body.sex == 1) {
        or.push({ gender: "female" });
      } else {
        or.push({ gender: "male" });
        or.push({ gender: "female" });
        or.push({ gender: "other" });
      }
      helper.push({ $or: or });
    }

    if (!_.isUndefined(req.body.interests)) {
      let arr = req.body.interests.map((i) => i.interest);
     
      helper.push({ "interests.interest": { $in: [...arr] } });
    }

    const query = User.find({
      $and: helper,
    });
    query.setOptions({ lean: true });
    query.collection(User.collection);
    const user = await User.findById({ _id: req.user_id });

    const { range } = req.body;

    const result = await query.exec() //all
    
    // const result = await query.circle("lastKnownLocation", {
    //   center: user.lastKnownLocation.coordinates,
    //   radius: range / 6378.1,
    //   spherical: true,
    // });

 

    const uPoints = (await UserPoints.find({user_id:user._id}))[0]
   
    const results_with_distance = calculateDistance(
      user.lastKnownLocation.coordinates,
      result,true
    ).filter(i=> i.distance <= range) .filter(el => ! uPoints.dislike.includes(el._id));
    return res
      .status(200)
      .send(results_with_distance.filter((i) => i._id != req.user_id));
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const calculateDistance = (userLocation, arrOfPeople,isObject=false) => {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  function getDistanceFromLatLonInKm(mk1, mk2) {
    var R = 6371.1; // Radius of the Earth in km
    var rlat1 = mk1[0] * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = mk2[0] * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (mk2[1] - mk1[1]) * (Math.PI / 180); // Radian difference (longitudes)

    var d =
      2 *
      R *
      Math.asin(
        Math.sqrt(
          Math.sin(difflat / 2) * Math.sin(difflat / 2) +
            Math.cos(rlat1) *
              Math.cos(rlat2) *
              Math.sin(difflon / 2) *
              Math.sin(difflon / 2)
        )
      );
    return d;
  }

  const distanceArr = arrOfPeople.map((p) => {
    let distance = getDistanceFromLatLonInKm(
      userLocation,
      p.lastKnownLocation.coordinates
    );
    if(!isObject){
      p = p.toObject();
    
    }
    p.distance = distance;

    return p;
  });

  return distanceArr;
};

export const findSomeOne = async (req, res, next) => {
  try {
    //make range
    const range = 1000;

    const user = await User.findById({ _id: req.user_id });

    const query = User.find(); // ADD FILLTERS
    const users_results = await User.find({}) //all

    //get only unique categories
    const user_categories = new Set();

    user.interests.forEach((c) => {
      user_categories.add(c.category);
    });

    const results_with_distance=  calculateDistance(user.lastKnownLocation.coordinates,
      users_results).filter(i=> i.distance <= range);

    let search_user_Arr = [];


    results_with_distance
    .filter((i) =>!_.isEqual(i._id,user._id))//REMOVE MySelf
      .forEach((u) => {
        const sum_arr = [];

        user_categories.forEach((cat) => {
          const user_interest_cat_arr = user.interests
            .filter((i) => i.category == cat)
            .map((i) => i.interest);

          const search_user_intres_cat_arr = u.interests
            .filter((i) => i.category == cat)
            .map((i) => i.interest);
          let sum = 0;
          let max = user_interest_cat_arr.length;

          user_interest_cat_arr.forEach((el) => {
            if (search_user_intres_cat_arr.includes(el)) {
              sum++;
            }
          });

          if (sum < max) {
            let to_05 =
              0.5 -
              (0.5 *
                Math.abs(
                  search_user_intres_cat_arr.length -
                    user_interest_cat_arr.length
                )) /
                Math.max(
                  search_user_intres_cat_arr.length,
                  user_interest_cat_arr.length
                );

            sum += to_05;
          }

          sum_arr.push(sum / max);
        });

        let score = sum_arr.reduce((a, b) => a + b, 0);

       
        //age udaljenost od središta + 1
        score +=
          1 - Math.abs(user.age - u.age) / 15 < 0
            ? 0
            : 1 - Math.abs(user.age - u.age) / 15;
// TODO AKO Sex Orinet tražim žene -> suprotno ako je biseskual oboje
        //sexsual orientation  različit spol  && orijentacija +1  , bisesksual +0.5 /+1
        let helper = 0;
        // if (user.sexualOrientation == u.sexualOrientation) {
        //   helper++;
        // } else if (user.sexualOrientation == 2 || u.sexualOrientation == 2) {
        //   helper += 0.5;
        // }
        // if (user.gender != u.gender) { //TODO MALE -> FAMALE
        //   helper++;
        // }

        if(user.sexualOrientation == 2){
          if(u.gender != user.gender  && u.sexualOrientation==0){
            helper++;
          }
          else if(u.gender == user.gender || u.gender == 'other' && u.sexualOrientation== 1 ){
            helper++;
          }
          else if(u.sexualOrientation==2){
            helper++;
          }
     
        } else if (user.sexualOrientation==1 && u.sexualOrientation ==1 && u.gender == user.gender){
          helper++;
        }

        else if (user.sexualOrientation==0 && u.sexualOrientation==0){
          if(u.gender == 'male' && user.gender=='famale'){
            helper++
          }
          else if(u.gender=='female' && user.gender == 'male'){
            helper++
          }
        }

        //TODO ADD SEXSUAL INTEREST
        score += helper / 2;

        let search_user = u
        search_user.score = score / (2+ sum_arr.length); // max score 1 , 1 point for categories , 1 for age , 1 for sexsual
     
        search_user_Arr.push(search_user);
      });
    
    //TODO REMOVE BLOCKED
    
    const uPoints = (await UserPoints.find({user_id:user._id}))[0]

    search_user_Arr = search_user_Arr.filter(el => ! uPoints.dislike.includes(el._id))
    search_user_Arr = search_user_Arr.filter(e=>!isNaN(e.score)).sort((a,b)=> b.score-a.score ).slice(0,10).filter(el=>el.score>0.05)

    return res.status(200).send(search_user_Arr);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
