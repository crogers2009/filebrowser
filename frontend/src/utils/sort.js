import { getTypeInfo } from "@/utils/mimetype";

export function sortedItems(items = [], sortby="name", asc=true) {
    return items.sort((a, b) => {
        let valueA = a[sortby];
        let valueB = b[sortby];

        // Special handling for duration which is stored in metadata
        if (sortby === "duration") {
            valueA = a.metadata?.duration ?? 0;
            valueB = b.metadata?.duration ?? 0;
        }

        // Sort by normalized file category (directory, image, video, etc.)
        if (sortby === "type") {
            valueA = getTypeInfo(a.type || "").simpleType;
            valueB = getTypeInfo(b.type || "").simpleType;
            const comparison = valueA.localeCompare(valueB, undefined, { sensitivity: "base" });
            if (comparison === 0) {
                const nameComparison = (a.name || "").localeCompare(b.name || "", undefined, {
                    numeric: true,
                    sensitivity: "base",
                });
                return asc ? nameComparison : -nameComparison;
            }
            return asc ? comparison : -comparison;
        }

        if (sortby === "name") {
            // Use localeCompare with numeric option for natural sorting
            const comparison = valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
            return asc ? comparison : -comparison;
        }

        // Default sorting for other fields
        if (asc) {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
}
