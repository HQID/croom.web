import { useState, useRef, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css';
import axios from 'axios';
import { AddIcon, InfoIcon } from '@chakra-ui/icons'
import CalendarSkeleton from '../utils/CalendarSkeleton';
import {toast} from 'react-hot-toast'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel, 
  Input,
  Button
} from '@chakra-ui/react'

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
  const initialRef = useRef(null)
  const finalRef = useRef(null)
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStart, setNewEventStart] = useState('');
  const [newEventEnd, setNewEventEnd] = useState('');
  const [editEventTitle, setEditEventTitle] = useState('');
  const [editEventStart, setEditEventStart] = useState('');
  const [editEventEnd, setEditEventEnd] = useState('');

  useEffect(() => {
    axios.get('/schedule')
      .then((res) => {
        const fetchedEvents = res.data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(fetchedEvents);
      })
      .catch((error) => {
        console.log(error)
        toast.error(error.message)
      })
      .finally(() => {
        setLoading(false);
      })
  }, [])

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setEditEventTitle(event.title);
    setEditEventStart(moment(event.start).format('YYYY-MM-DDTHH:mm'));
    setEditEventEnd(moment(event.end).format('YYYY-MM-DDTHH:mm'));
    onOpenEdit();
  };

  const handleAddEventSubmit = async () => {
    const newEvent = {
      title: newEventTitle,
      start: new Date(newEventStart),
      end: new Date(newEventEnd),
    };

    try {
      const {data} = await axios.post('/schedule', newEvent)
      if(data.error) {
        toast.error(data.error);
      } else {
        setEvents([...events, data]);
        toast.success('Event added');
        setNewEventTitle('');
        setNewEventStart('');
        setNewEventEnd('');
        onCloseAdd();
      }
    } catch (err) {
        console.log(err)
        toast.error('An error occurred while adding event');
        setNewEventTitle('');
        setNewEventStart('');
        setNewEventEnd('');
        onCloseAdd();
    }
  };

  const handleEditEventSubmit = async () => {
    const updatedEvent = {
      ...selectedEvent,
      title: editEventTitle,
      start: new Date(editEventStart),
      end: new Date(editEventEnd),
    };

    const previousEvents = [...events];

    try {
      const {data} = await axios.put(`/schedule/${updatedEvent._id}`, updatedEvent)
      if(data.error) {
        toast.error(data.error);
      } else {
          setEvents(events.map(event => (event._id === updatedEvent._id ? updatedEvent : event)));
          toast.success('Event updated');
          setEditEventTitle('');
          setEditEventStart('');
          setEditEventEnd('');
          onCloseEdit();
      }
    } catch (err) {
        console.log(err);
        toast.error('Error updating event');
        setEvents(previousEvents);
        setEditEventTitle('');
        setEditEventStart('');
        setEditEventEnd('');
        onCloseEdit();
    }

  }; 

  const handleDeleteEvent = async (id) => {
    const previousEvents = [...events]

    try {
      const {data} = await axios.delete(`/schedule/${id}`)
      if(data.error) {
        toast.error(data.error);
      } else {
        setEvents(events.filter(event => event.id !== id));
        toast.success('Event deleted');
      }
    } catch(err) {
      console.log('Error deleting event:', err);
      toast.error('Error deleting event');
      setEvents(previousEvents)
    }
  };

  return (
    <>
    {/* CALENDAR */}
    <div id="my-calendar" className="w-full mobile:order-last">
    {loading ? (<CalendarSkeleton/>) : (
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className="shadow-lg rounded-lg"
        onSelectEvent={handleEventSelect}
      />
    )}
      </div>
    
      {/* INFO CONTENT */}
      <div className='w-1/4 flex flex-col gap-3 mobile:w-full mobile:text-xs'>
        <h1 className='text-2xl font-semibold mb-2 text-slate-700'>My Schedule</h1>
        <div className=' bg-slate-700 p-3 rounded-lg flex flex-row gap-3'>
              <AddIcon bg='white' w={6} h={6} borderRadius='full' p={1} mt={1} cursor='pointer' onClick={onOpenAdd}/>
            <div className='text-white text-sm'>
              <p className='font-semibold'>Add New Event</p>
              <p className='font-thin'>Click here for add new event</p>
            </div>
      </div>
        <div className=' bg-slate-700 p-3 rounded-lg mb-6 flex flex-row gap-3'>
            <div className='text-white text-sm'>
              <InfoIcon w={5} h={5} color="" />
              <span className='font-semibold ml-2'>Double Click an event for edit and delete</span>
            </div>
        </div>
      </div>
    {/* MODAL FORM ADD*/}
    <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpenAdd}
        onClose={onCloseAdd}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Event Name</FormLabel>
              <Input ref={initialRef} placeholder='Event Name' value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Start at:</FormLabel>
              <Input type='datetime-local' value={newEventStart} onChange={(e) => setNewEventStart(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>End at:</FormLabel>
              <Input type='datetime-local' value={newEventEnd} onChange={(e) => setNewEventEnd(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button bg='gray.700' color='white' mr={4} _hover={{bg:'gray.500'}} borderRadius="xl" fontSize="lg" px={5} py={4} onClick={handleAddEventSubmit}>
              Save
            </Button>
            <Button borderRadius="xl" fontSize="lg" px={5} py={4} onClick={onCloseAdd}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* MODAL FORM EDIT*/}
    <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Event Name</FormLabel>
              <Input ref={initialRef} value={editEventTitle} onChange={(e) => setEditEventTitle(e.target.value)} placeholder="Event Name" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Start at:</FormLabel>
              <Input type="datetime-local" value={editEventStart} onChange={(e) => setEditEventStart(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>End at:</FormLabel>
              <Input type="datetime-local" value={editEventEnd} onChange={(e) => setEditEventEnd(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button bg='gray.700' color='white' mr={4} _hover={{bg:'gray.500'}} borderRadius="xl" fontSize="lg" px={5} py={4} onClick={handleEditEventSubmit}>
              Save
            </Button>
            <Button bg='red.500' color='white' _hover={{bg:'red.300'}} borderRadius="xl" fontSize="lg" px={5} py={4} onClick={() => {
                handleDeleteEvent(selectedEvent._id);
                onCloseEdit();
              }}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    
  );
};

export default MyCalendar;
