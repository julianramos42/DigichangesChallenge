import mongoose from "mongoose";

export interface SpecieData {
    name: string;
    classification: string;
    designation: string;
    average_height: string;
    average_lifespan: string;
    eye_colors: string;
    hair_colors: string;
    skin_colors: string;
    language: string;
    homeworld?: string;
    people: string[];
    films: string[];
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
}


const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        classification: { type: String, required: true },
        designation: { type: String, required: true },
        average_height: { type: String, required: true },
        average_lifespan: { type: String, required: true },
        eye_colors: { type: String, required: true },
        hair_colors: { type: String, required: true },
        skin_colors: { type: String, required: true },
        language: { type: String, required: true },
        homeworld: { type: String },
        people: [{ type: String, required: true }],
        films: [{ type: String, required: true }],  
        url: { type: String, required: true }
    }, {
    timestamps: true
}
);

const Specie = mongoose.model('species', schema);
export default Specie;