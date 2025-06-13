import React, { useState } from "react";
import "../Styles/booking.css";
import logo from "../assets/nailbyelif.png";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

const generateWeekDays = (offsetDays = 0) => {
  const days = [];
  const today = new Date();
  today.setDate(today.getDate() + offsetDays);
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    const formatted = nextDay.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    days.push(formatted);
  }
  return days;
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 19; hour++) {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(0);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    slots.push(formattedTime);
  }
  return slots;
};

const getTodayDateString = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const getCurrentHour = () => new Date().getHours();

const bookedSlots = [
  { day: "Wed, Apr 24", time: "11:00 AM" },
  { day: "Thu, Apr 25", time: "3:00 PM" },
];

const times = generateTimeSlots();

export default function BookingPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState({ day: null, time: null });
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
  });
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    const phoneRegex = /^0\d{10}$/;

    if (!phoneRegex.test(formData.phone)) {
      alert(
        "Lütfen başında 0 olan geçerli bir telefon numarası girin. Örn: 05551234567"
      );
      return;
    }

    console.log("Booking submitted:", { ...formData, ...selected });
    setStep(3);
  };

  const days = generateWeekDays(weekOffset);

  return (
    <div className="booking-wrapper">
      <div className="logo-container">
        <img src={logo} alt="Nail By Elif Logo" className="logo-image" />
      </div>

      <div className="contact-info corner">
        <a
          href="https://instagram.com/nailbyelif"
          target="_blank"
          rel="noopener noreferrer"
          className="insta-link"
        >
          <FaInstagram className="icon" /> @nailbyelif
        </a>
        <div className="phone-number">
          <FaWhatsapp className="icon" /> +90 555 123 4567
        </div>
      </div>

      {step === 1 && (
        <>
          <div className="week-navigation">
            {weekOffset > 0 && (
              <button
                className="button small-button"
                onClick={() => setWeekOffset(weekOffset - 7)}
              >
                ◀ Previous Week
              </button>
            )}
            <button
              className="button small-button"
              onClick={() => setWeekOffset(weekOffset + 7)}
            >
              Next Week ▶
            </button>
          </div>

          <div className="calendar-week-grid">
            {days.map((day) => (
              <div
                key={day}
                className={`calendar-day-column ${
                  day === getTodayDateString() ? "today" : ""
                }`}
              >
                <div className="day-header">{day}</div>
                {times.map((time) => {
                  const isToday = day === getTodayDateString();
                  const isPastTime =
                    isToday && parseInt(time) < getCurrentHour();
                  const isBooked = bookedSlots.some(
                    (slot) => slot.day === day && slot.time === time
                  );

                  const slotClass = isBooked
                    ? "calendar-time-slot booked"
                    : isPastTime
                    ? "calendar-time-slot disabled"
                    : "calendar-time-slot";

                  return (
                    <div
                      key={`${day}-${time}`}
                      className={slotClass}
                      onClick={
                        !isPastTime && !isBooked
                          ? () => {
                              setSelected({ day, time });
                              setStep(2);
                            }
                          : undefined
                      }
                    >
                      {time}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <div className="form-box">
          <h2 className="form-title">
            Booking for {selected.day} at {selected.time}
          </h2>
          <input
            className="input"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Surname"
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="05xxxxxxxxx"
            value={formData.phone}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[0-9]*$/.test(val)) {
                setFormData({ ...formData, phone: val });
              }
            }}
          />
          <button className="button confirm-button" onClick={handleSubmit}>
            Confirm Booking
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="confirmation-box">
          <h2 className="thank-you">Thank you!</h2>
          <p className="confirmation-msg">
            Your appointment on {selected.day} at {selected.time} has been
            booked.
          </p>
        </div>
      )}
    </div>
  );
}
