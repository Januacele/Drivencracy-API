
import joi from "joi";

const pollSchema = joi.object({
    title: joi.string().required(),
    expireAt: joi.string().allow("")
});

export default pollSchema;