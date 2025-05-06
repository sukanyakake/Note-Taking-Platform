const LabelComponent = ({ labels, onLabelChange }) => {
    const [newLabel, setNewLabel] = useState('');
  
    const handleAddLabel = () => {
      if (newLabel) {
        onLabelChange([...labels, newLabel]);
        setNewLabel('');
      }
    };
  
    return (
      <div className="flex items-center gap-x-2">
        {labels.map((label, index) => (
          <span
            key={index}
            className="bg-blue-200 text-blue-800 py-1 px-3 rounded-full text-sm"
          >
            {label}
          </span>
        ))}
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add label"
          className="border px-3 py-1 rounded-md text-sm"
        />
        <button
          type="button"
          onClick={handleAddLabel}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Add
        </button>
      </div>
    );
  };
  