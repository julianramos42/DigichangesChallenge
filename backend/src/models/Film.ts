import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        episode_id: { type: Number, required: true },
        opening_crawl: { type: String, required: true },
        director: { type: String, required: true },
        producer: { type: String, required: true },
        release_date: { type: Date, required: true },
        species: [{ type: String, required: true }],  
        starships: [{ type: String, required: true }],
        vehicles: [{ type: String, required: true }], 
        characters: { type: String, required: true }, 
        planets: [{ type: String, required: true }],    
        url: { type: String, required: true }
    }, {
    timestamps: true
}
);

const Film = mongoose.model('films', schema);
export default Film;