const Trash = () => {
    const [notes, setNotes] = useState([]);
    const { user } = useAuth();
  
    useEffect(() => {
      const fetchNotes = async () => {
        try {
          const { data } = await axios.get("/api/note", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const trashedNotes = data.notes.filter(note => note.isDeleted);
          setNotes(trashedNotes);
        } catch (error) {
          console.error("Failed to fetch notes:", error);
        }
      };
      if (user) fetchNotes();
    }, [user]);
  
    return (
      <div>
        {notes.length === 0 ? <p>No Notes in Trash</p> : notes.map(note => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    );
  };
  
  export default Trash;
  