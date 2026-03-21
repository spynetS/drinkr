from fastapi import APIRouter
from events.event import Event
from pydantic import BaseModel


router = APIRouter()

@router.get("/events/", tags=["events"])
async def read_events():
    return Event.get_all()


class EventCreate(BaseModel):
    data: str
    type: int
    creator: int
    sendto: int | None = None


@router.post("/events/", tags=["events"])
async def read_events(eventCreate: EventCreate):
    event = Event()
    event.data = eventCreate.data
    event.type = eventCreate.type
    event.creator = eventCreate.creator
    event.sendto = eventCreate.sendto
    event.save()
    
    return Event.get_all()
