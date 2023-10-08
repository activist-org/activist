let uuid = 0;

export default function useUniqueID() {
  const getID = () => {
    uuid++;
    return string(uuid);
  };

  return {
    getID,
  };
}
