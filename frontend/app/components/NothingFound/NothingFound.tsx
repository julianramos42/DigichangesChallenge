export default function nothingFound() {
    return (
        <div className="flex-grow p-4">
            <div className="text-cardForeground p-4 rounded-lg gap-3 min-h-40 flex flex-col justify-center">
                <h3 className="text-lg font-semibold">Nothing Found</h3>
                <p className="text-sm text-muted">Try going back to page 1 or clearing the filters.</p>
            </div>
        </div>
    );
}