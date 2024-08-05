import { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import NotesSkeleton from '../utils/NotesSkeleton';
import axios from 'axios';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Button
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-hot-toast'

const Tasks = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const navigate = useNavigate()

  // Fetch notes from API
  useEffect(() => {
    axios.get('/verify')
    .then((res) => {
      if(!res.data.status) {
        navigate('/login')
      }
    })
    axios.get('/notes')
      .then(res => {
        setNotes(res.data);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addNote = async () => {
    const newNote = {
      title: 'New Note',
      tags: ['Tag 1', 'Tag 2'],
      content: 'This is a new note.',
      updatedAt: new Date().getTime(),
    };

    try {
      const {data} = await axios.post('/notes', newNote)
      if (data.error) {
        toast.error(data.error);
      } else {
        setNotes([...notes, data]);
        // setNoteTitle(newNote.title);
        // setNoteTags(newNote.tags.join(', '));
        // setNoteContent(newNote.content);
      }
    } catch(err) {
      console.log('Error adding note:', err);
      toast.error('Note creation failed');
    }
  };

  const handleNoteClick = (id) => {
    const note = notes.find((note) => id === note._id);
    setActiveNote(note);
    setActiveNoteId(id);
    setNoteTitle(note.title);
    setNoteTags(note.tags.join(', '));
    setNoteContent(note.content);
  };

  const saveNote = async () => {
    const updatedNote = {
      ...activeNote,
      title: noteTitle,
      tags: noteTags.split(', '),
      content: noteContent,
    };

    const previousNotes = [...notes];
    
    try {
      const {data} = await axios.put(`/notes/${activeNote._id}`, updatedNote)
      
      if(data.error) {
        toast.error(data.error);
      } else {
        setNotes(notes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        ));
        toast.success('Note updated');
      }

    } catch (err) {
        toast.error('Note update failed');
        console.log('Error updating note:', err);
        setNotes(previousNotes);
    }
  };  

  const deleteNote = async () => {
    const previousNotes = [...notes]

    try {
      const {data} = await axios.delete(`/notes/${activeNoteId}`)
      if(data.error) {
        toast.error(data.error);
      } else {
        setNotes(notes.filter((note) => note._id !== activeNoteId));
        setActiveNoteId(null);
        setActiveNote(null);
        setNoteTitle('');
        setNoteTags('');
        setNoteContent('');
        toast.success('Note deleted');
      }
    } catch (err) {
        toast.error('Note deletion failed');
        console.log('Error deleting note:', err);
        setNotes(previousNotes);
    }
  };

  const searchNotes = async () => {
    try {
      const { data } = await axios.get('/search', {
        params: { keyword: keywords }
      });
      if(data.error) {
        toast.error(data.error);
      } else {
        setNotes(data);
      }
    } catch (err) {
      console.log('Error fetching notes:', err);
      toast.error('Error searching notes');
    }
  }

  useEffect(() => {
    searchNotes();
  }, [keywords]);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)
  const finalRef = useRef(null)

  return (
    <>
      <Sidebar />
      <div className="flex">
        {/* NOTE MENU */}
        <div className="flex w-1/5 h-screen flex-col border-e bg-slate-50 fixed left-[64px] z-9 pt-16 mobile:left-0 mobile:w-full">
          <div className="px-4 py-6 relative">
            <input
              type="text"
              className="focus:outline-none focus:ring-primary focus:ring-1 border-[1px] border-slate-400 rounded-md w-full pl-8"
              placeholder="Search Notes"
              onChange={(e) => setKeywords(e.target.value)}
            />
            <SearchIcon position='absolute' top='29px' left='24px' color='gray.500'/>
          </div>
          <div className="flex flex-row p-4 justify-between mobile:py-2 mobile:px-6">
            <p className="font-semibold text-sm">MY NOTES</p>
            <div className='flex gap-4 mobile:gap-5'>
            <AddIcon boxSize={5} onClick={addNote} cursor='pointer' color='gray.700'/>
            <div className='hidden mobile:flex'>
              <DeleteIcon boxSize={5} cursor='pointer' color='gray.700' onClick={deleteNote}/>
            </div>
            
            </div>
            
          </div>
          <div className="flex flex-col px-4 py-2 gap-4 overflow-scroll no-scrollbar h-3/4 cursor-pointer mobile:h-full mobile:px-6">
          {loading ? (<NotesSkeleton/>) : (
            notes?.map((note) => (
              <div
                key={note._id}
                className={`w-full p-2 bg-white rounded-md shadow-sm shadow-slate-400 border-2 ${
                  activeNoteId === note._id ? 'border-blue-200' : 'border-transparent'
                }`}
                onClick={() => handleNoteClick(note._id)}
              >
                <p className="line-clamp-1 font-semibold">{note.title}</p>
                <hr className="border-[1px] my-3" />
                <p className="text-xs line-clamp-4 font-semibold text-slate-500 mobile:line-clamp-6">
                  {note.content}
                </p>
                <div className="mt-4 flex flex-row gap-2 overflow-scroll no-scrollbar mb-1.5">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="max-h-6 bg-gray-900 text-white py-1 px-2 text-xs rounded-[6px] font-semibold overflow-visible"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="hidden mobile:flex justify-end text-xs">
                    <EditIcon boxSize={6} cursor='pointer' color='gray.700' onClick={onOpen}/>
                </div>
              </div>
            ))
          )
          
          }
            
          </div>
        </div>

        {/* NOTE PAGES */}
        <div className="flex-1 pt-12 mobile:hidden">
          {activeNote ? (
            <div className="py-8 px-16 ml-[300px]">
              <p className="text-end text-slate-700">
                Updated at {new Date(activeNote.updatedAt).toLocaleDateString()}
              </p>
              <input
                type="text"
                placeholder="Note Title"
                className="text-4xl w-full p-2 font-bold focus:outline-none"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Tag 1, Tag 2, Tag 3"
                className="text-xl w-full p-2 focus:outline-none font-semibold"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
              />
              <textarea
                className="w-full p-2 text-lg h-[400px] resize-none no-scrollbar focus:outline-none"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              ></textarea>
              <div className="flex gap-3 justify-end">
                <button
                  className="font-semibold text-lg py-2 px-3 bg-slate-700 text-white rounded-xl hover:opacity-80 shadow-lg transition duration-500"
                  onClick={saveNote}
                >
                  Save Note
                </button>
                <button className="font-semibold text-lg py-2 px-3 bg-red-500 text-white rounded-xl hover:opacity-80 shadow-lg transition duration-500" onClick={deleteNote}>
                  Delete Note
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[100vh] py-8 px-16 ml-[300px] flex justify-center items-center mobile:hidden">
              <h1 className="font-bold text-slate-400 text-2xl">No Notes here</h1>
            </div>
          )}
        </div>
      </div>
      {/* MODAL FOR MOBILE */}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        size='full'
      >
        <ModalOverlay/>
        <ModalContent>

          <ModalBody pb={6} pt={6}>
          <p className="text-end text-slate-700"> 
              Updated at {new Date(activeNote?.updatedAt).toLocaleDateString()}
            </p>
            <input
              type="text"
              placeholder="Note Title"
              className="text-2xl w-full p-2 font-bold focus:outline-none"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tag 1, Tag 2, Tag 3"
              className="text-md w-full p-2 focus:outline-none font-semibold"
              value={noteTags}
              onChange={(e) => setNoteTags(e.target.value)}
            />
            <textarea
              className="w-full p-2 text-sm h-[450px] resize-none no-scrollbar focus:outline-none"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            ></textarea>
          </ModalBody>

          <ModalFooter>
            <Button bg='gray.700' color='white' mr={4} _hover={{bg:'gray.500'}} borderRadius="xl" fontSize="lg" px={5} py={4} onClick={() => {
              saveNote();
              onClose();
            }}>
              Save
            </Button>
            <Button onClick={onClose} bg='red.500' color='white' _hover={{bg:'red.300'}} borderRadius="xl" fontSize="lg" px={5} py={4}>Discard</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Tasks;
