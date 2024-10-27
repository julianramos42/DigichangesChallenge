import mongoose from "mongoose";

export interface StarshipData {
    name: string;
    model?: string;
    starship_class: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    crew: string;
    passengers: string;
    max_atmosphering_speed: string;
    hyperdrive_rating: string;
    MGLT: string;
    cargo_capacity: string;
    consumables: string;
    films: string[];
    pilots: string[];
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        model: { type: String, required: true },
        starship_class: { type: String, required: true },
        manufacturer: { type: String, required: true },
        cost_in_credits: { type: String, required: true },
        length: { type: String, required: true },
        crew: { type: String, required: true },
        passengers: { type: String, required: true },
        max_atmosphering_speed: { type: String, required: true },
        hyperdrive_rating: { type: String, required: true },
        MGLT: { type: String, required: true },
        cargo_capacity: { type: String, required: true },
        consumables: { type: String, required: true },
        films: [{ type: String, required: true }],  
        pilots: [{ type: String, required: true }],
        url: { type: String, required: true }
    }, {
    timestamps: true
}
);

const Starship = mongoose.model('starships', schema);
export default Starship;