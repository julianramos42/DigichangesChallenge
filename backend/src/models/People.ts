import mongoose from "mongoose";

export interface PeopleData {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld?: string;
    films: string[];
    species: string[];
    vehicles: string[];
    starships: string[];
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        height: { type: String, required: true },
        mass: { type: String, required: true },
        hair_color: { type: String, required: true },
        skin_color: { type: String, required: true },
        eye_color: { type: String, required: true },
        birth_year: { type: String, required: true },
        gender: { type: String, required: true },
        homeworld: { type: Object },
        films: [{ type: String, required: true }], 
        species: [{ type: String, required: true }], 
        vehicles: [{ type: String, required: true }], 
        starships: [{ type: String, required: true }], 
        url: { type: String, required: true }
    }, {
    timestamps: true
}
);

const People = mongoose.model('people', schema);
export default People;