import React, { useEffect, useState } from "react";
import axios from "axios";

const MeetingRoom = () => {
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [meetingLink, setMeetingLink] = useState(""); // Store dynamic meeting link

  const [salesperson, setSalesperson] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [purpose, setPurpose] = useState("Pitch");

  useEffect(() => {
    if (meetingStarted) {
      setStartTime(Date.now());
      const interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [meetingStarted, startTime]);

  const startMeeting = async () => {
    if (!clientName || !purpose) {
      alert("Please fill out client name and purpose.");
      return;
    }

    try {
      const meetingData = {
        salesperson,
        clientName,
        clientEmail,
        purpose,
        startedAt: new Date(),
        durationInSeconds: duration,
      };

      const response = await axios.post("http://localhost:5000/api/meeting/add-meeting", meetingData);
      console.log("Meeting started", response.data);

      // Use the dynamic meeting link from the backend response
      setMeetingLink(response.data.meetingLink);

      setMeetingStarted(true);
      setStartTime(Date.now()); // Start the timer for the meeting
    } catch (error) {
      console.error("Error starting meeting:", error);
    }
  };

  const endMeeting = async () => {
    setMeetingEnded(true);
    const endTime = Date.now();
    const meetingData = {
      salesperson,
      clientName,
      clientEmail,
      purpose,
      startedAt: new Date(startTime),
      durationInSeconds: Math.floor((endTime - startTime) / 1000),
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/meeting/update-meeting/${response.data._id}`, meetingData); // Use PUT to update existing meeting
      console.log("Meeting saved", response.data);

      // Use the dynamic meeting link from backend response
      setMeetingLink(response.data.meetingLink);
    } catch (error) {
      console.error("Error saving meeting:", error);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {!meetingStarted ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Start Sales Meeting</h2>
          <div>
            <label className="block font-medium">Salesperson</label>
            <input
              value={salesperson}
              onChange={(e) => setSalesperson(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Client Name</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Client Email</label>
            <input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full border p-2 rounded"
              type="email"
            />
          </div>
          <div>
            <label className="block font-medium">Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option>Pitch</option>
              <option>Demo</option>
              <option>Follow-up</option>
              <option>Negotiation</option>
              <option>Closing</option>
            </select>
          </div>
          <button
            onClick={startMeeting}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start Meeting
          </button>
        </div>
      ) : !meetingEnded ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Meeting in Progress</h2>
          <iframe
            src={meetingLink}  // Use the dynamic meeting link
            allow="camera; microphone; fullscreen; display-capture"
            style={{ width: "100%", height: "600px", borderRadius: "10px", border: "none" }}
            title="Sales Meeting"
          ></iframe>

          <div className="flex justify-between items-center mt-4">
            <p>Duration: <strong>{formatDuration(duration)}</strong></p>
            <button
              className="bg-red-600 text-white px-6 py-2 rounded"
              onClick={endMeeting}
            >
              End Meeting
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-6">
          <h3 className="text-lg font-semibold">Meeting Ended</h3>
          <p>Duration: {formatDuration(duration)}</p>
          <p>
            <strong>Meeting Link: </strong>
            <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Join the Meeting
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;