import React, { createContext, useState, useContext, useEffect } from 'react';
import useItemLookup from '../hooks/useItemLookup';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [diamonds, setDiamonds] = useState(() => parseInt(localStorage.getItem('ff_diamonds') || '9999999999'));
  const [gold, setGold] = useState(() => parseInt(localStorage.getItem('ff_gold') || '9999999999'));
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState({
    avatar: null,
    banner: null,
    character: null
  });

  const { getItem, loading: itemsLoading } = useItemLookup();

  // New Profile State
  const [playerName, setPlayerName] = useState('Survivor');
  const [playerBio, setPlayerBio] = useState('I love Free Fire!');
  const [xp, setXp] = useState(0);

  // Derived Level State
  const level = Math.floor(Math.sqrt(xp) / 10) + 1;

  useEffect(() => {
    const savedDiamonds = localStorage.getItem('ff_diamonds');
    const savedGold = localStorage.getItem('ff_gold');
    const savedInventory = localStorage.getItem('ff_inventory');
    const savedEquipped = localStorage.getItem('ff_equipped');
    const savedName = localStorage.getItem('ff_player_name');
    const savedBio = localStorage.getItem('ff_player_bio');
    const savedXp = localStorage.getItem('ff_xp');

    if (savedDiamonds) setDiamonds(parseInt(savedDiamonds));
    if (savedGold) setGold(parseInt(savedGold));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedEquipped) setEquipped(JSON.parse(savedEquipped));
    if (savedName) setPlayerName(savedName);
    if (savedBio) setPlayerBio(savedBio);
    if (savedXp) setXp(parseInt(savedXp));
  }, []);

  // Hydrate inventory and equipped items with fresh data (images)
  useEffect(() => {
    if (itemsLoading) return;

    let inventoryChanged = false;
    const newInventory = inventory.map(item => {
      const freshItem = getItem(item.id);
      // Update if image is missing or different
      if (freshItem && freshItem.image && freshItem.image !== item.image) {
        inventoryChanged = true;
        return { ...item, image: freshItem.image };
      }
      return item;
    });

    if (inventoryChanged) {
      setInventory(newInventory);
      localStorage.setItem('ff_inventory', JSON.stringify(newInventory));
    }

    // Also update equipped
    let equippedChanged = false;
    const newEquipped = { ...equipped };
    ['avatar', 'banner', 'character'].forEach(type => {
      const item = newEquipped[type];
      if (item) {
        const freshItem = getItem(item.id);
        if (freshItem && freshItem.image && freshItem.image !== item.image) {
          newEquipped[type] = { ...item, image: freshItem.image };
          equippedChanged = true;
        }
      }
    });

    if (equippedChanged) {
      setEquipped(newEquipped);
      localStorage.setItem('ff_equipped', JSON.stringify(newEquipped));
    }

  }, [itemsLoading, getItem, inventory, equipped]);

  const addDiamonds = (amount) => {
    const newValue = diamonds + amount;
    setDiamonds(newValue);
    localStorage.setItem('ff_diamonds', newValue);
  };

  const subtractDiamonds = (amount) => {
    if (diamonds >= amount) {
      const newValue = diamonds - amount;
      setDiamonds(newValue);
      localStorage.setItem('ff_diamonds', newValue);
      return true;
    }
    return false;
  };

  const addGold = (amount) => {
    const newValue = gold + amount;
    setGold(newValue);
    localStorage.setItem('ff_gold', newValue);
  };

  const subtractGold = (amount) => {
    if (gold >= amount) {
      const newValue = gold - amount;
      setGold(newValue);
      localStorage.setItem('ff_gold', newValue);
      return true;
    }
    return false;
  };

  const addXp = (amount) => {
    const newValue = xp + amount;
    setXp(newValue);
    localStorage.setItem('ff_xp', newValue);
  };

  const buyItem = (item, price, currency) => {
    // Check if already owned
    if (inventory.some(i => i.id === item.id)) return { success: false, message: "Already owned" };

    let success = false;
    if (currency === 'diamonds') {
      success = subtractDiamonds(price);
    } else if (currency === 'gold') {
      success = subtractGold(price);
    }

    if (success) {
      const newInventory = [...inventory, item];
      setInventory(newInventory);
      localStorage.setItem('ff_inventory', JSON.stringify(newInventory));
      addXp(50); // Award 50 XP for purchase
      return { success: true, message: "Item purchased! +50 XP" };
    } else {
      return { success: false, message: `Not enough resources` };
    }
  };

  const equipItem = (type, item) => {
    const key = type.toLowerCase();
    const newEquipped = { ...equipped, [key]: item };
    setEquipped(newEquipped);
    localStorage.setItem('ff_equipped', JSON.stringify(newEquipped));
  };

  const updateProfile = (name, bio) => {
    setPlayerName(name);
    setPlayerBio(bio);
    localStorage.setItem('ff_player_name', name);
    localStorage.setItem('ff_player_bio', bio);
  };

  return (
    <CurrencyContext.Provider value={{
      diamonds, gold,
      addDiamonds, subtractDiamonds,
      addGold, subtractGold,
      inventory, equipped,
      buyItem, equipItem,
      playerName, playerBio, updateProfile,
      xp, level, addXp
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
