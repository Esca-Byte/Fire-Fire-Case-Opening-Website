import { useState, useEffect, useMemo, useCallback } from 'react';
import extraItems from '../data/extraItems.json';

const useItemLookup = () => {
    const [items, setItems] = useState([]);
    const [imageMapData, setImageMapData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch itemData and imageMap
                const [itemRes, mapRes] = await Promise.all([
                    fetch('/assets/itemData.json'),
                    fetch('/assets/imageMap.json')
                ]);

                if (!itemRes.ok || !mapRes.ok) {
                    throw new Error('Failed to fetch core data');
                }

                const itemData = await itemRes.json();
                const mapData = await mapRes.json();

                // Merge items with imported extraItems
                // Note: We use the imported JSON directly, ensuring it's available.
                setItems([...itemData, ...extraItems]);
                setImageMapData(mapData);
                setLoading(false);
            } catch (err) {
                console.error("Error loading data:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Create a lookup map for O(1) access
    const itemMap = useMemo(() => {
        const map = new Map();
        items.forEach(item => {
            const idStr = String(item.itemID);
            // Inject image path from map OR use existing image property
            const imagePath = item.image || imageMapData[idStr] || null;
            map.set(idStr, { ...item, image: imagePath });
        });
        return map;
    }, [items, imageMapData]);

    const getItem = useCallback((id) => {
        if (!id) return null;
        return itemMap.get(String(id));
    }, [itemMap]);

    const getImagePath = useCallback((id) => {
        if (!id) return null;
        const item = itemMap.get(String(id));
        return item ? item.image : null;
    }, [itemMap]);

    return { items, getItem, getImagePath, loading, error };
};

export default useItemLookup;
