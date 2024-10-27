import mongoose from "mongoose";

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