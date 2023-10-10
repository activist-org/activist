let UUID = 0;

export default function useUniqueID() {
  const getID = () => {
    UUID++;
    return String(UUID);
  };

  return {
    getID,
  };
}
