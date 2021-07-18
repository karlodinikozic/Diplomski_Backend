
import {default as axios} from 'axios'

import Joi from 'joi'
import { default as _ } from 'lodash';

export const validateRangeFilter = (obj) =>{
    const rangeSchema = Joi.object({
      range:Joi.number().min(0.01).max(500),
    })
  
    const {error}  = rangeSchema.validate(obj)
    return error;
  }
  

export const validateFilterBody = (obj) =>{
  const filterSchema = Joi.object({
    range:Joi.number().min(5).max(500),
  })

  const {error}  = filterSchema.validate(obj)
  return error;
}

