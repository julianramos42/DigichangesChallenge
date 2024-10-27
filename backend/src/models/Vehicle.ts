import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        model_: { type: String, required: true },
        vehicle_class: { type: String, required: true },
        manufacturer: { type: String, required: true },
        length: { type: String, required: true },
        cost_in_credits: { type: String, required: true },
        crew: { type: String, required: true },
        passengers: { type: String, required: true },
        max_atmosphering_speed: { type: String, required: true },
        cargo_capacity: { type: String, required: true },
        consumables: { type: String, required: true },
        films: [{ type: String, required: true }],  
        pilots: [{ type: String, required: true }],
        url: { type: String, required: true }
    }, {
    timestamps: true
}
);

const Vehicle = mongoose.model('vehicles', schema);
export default Vehicle;