import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        diameter: { type: String, required: true },
        rotation_period: { type: String, required: true },
        orbital_period: { type: String, required: true },
        gravity: { type: String, required: true },
        population: { type: String, required: true },
        climate: { type: String, required: true },
        terrain: { type: String, required: true },
        surface_water: { type: String, required: true },
        residents: [{ type: String, required: true }], 
        films: [{ type: String, required: true }], 
        url: { type: String, required: true }
    }, {
    timestamps: true
}
);

const Planet = mongoose.model('planets', schema);
export default Planet;