import React, { useState, useEffect } from "react";
import "../styles/LessonsPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const LessonsPage = ({ userRole }) => {
  const [lessons, setLessons] = useState([]);
  const [videos, setVideos] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: "", description: "" });
  const [newVideo, setNewVideo] = useState({ title: "", url: "" });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editLesson, setEditLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [currentRole, setCurrentRole] = useState(userRole); // Local state for role

  // Update local role state when userRole changes
  useEffect(() => {
    setCurrentRole(userRole);
  }, [userRole]);

  // Fetch lessons and videos
  useEffect(() => {
    const fetchLessonsAndVideos = async () => {
      try {
        const lessonsResponse = await fetch(`${API_URL}/lessons`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const lessonsData = await lessonsResponse.json();
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);

        const videosResponse = await fetch(`${API_URL}/videos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const videosData = await videosResponse.json();
        console.log("Videos fetched:", videosData); // Debugging
        setVideos(Array.isArray(videosData) ? videosData : []);
      } catch (error) {
        console.error("Error fetching lessons or videos:", error);
      }
    };

    fetchLessonsAndVideos();
  }, [currentRole]);

  // Helper to format YouTube URLs
  const formatYouTubeURL = (url) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?/]+)/;
    const match = url.match(regex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  // Add Lesson
  const handleAddLesson = async () => {
    if (newLesson.title && newLesson.description) {
      try {
        const response = await fetch(`${API_URL}/lessons`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(newLesson),
        });
        const data = await response.json();
        setLessons((prev) => [...prev, data]);
        setNewLesson({ title: "", description: "" });
      } catch (error) {
        console.error("Error adding lesson:", error);
      }
    }
  };

  // Edit Lesson
  const handleEditLesson = async () => {
    if (editLesson.title && editLesson.description) {
      try {
        const response = await fetch(`${API_URL}/lessons/${editLesson.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(editLesson),
        });
        const result = await response.json();
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.id === result.data.id ? result.data : lesson
          )
        );
        setSelectedLesson(result.data);
        setEditLesson(null);
        alert(result.message || "Lesson updated successfully!");
      } catch (error) {
        console.error("Error updating lesson:", error);
        alert("Failed to update lesson.");
      }
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await fetch(`${API_URL}/lessons/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
        setSelectedLesson(null); // Return to lesson list
        alert("Lesson deleted successfully!");
      } catch (error) {
        console.error("Error deleting lesson:", error);
      }
    }
  };

  // Add Video
  const handleAddVideo = async (lessonId) => {
    const formattedURL = formatYouTubeURL(newVideo.url);
    if (!formattedURL) {
      alert("Invalid YouTube URL. Please provide a valid link.");
      return;
    }

    if (newVideo.title && lessonId) {
      try {
        const response = await fetch(`${API_URL}/videos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            title: newVideo.title,
            url: formattedURL,
            lesson: { id: lessonId }, // Send lessonId properly
          }),
        });
        const result = await response.json();
        setVideos((prev) => [...prev, result.data]);
        setNewVideo({ title: "", url: "" });
        setIsModalOpen(false);
        alert("Video added successfully!");
      } catch (error) {
        console.error("Error adding video:", error);
        alert("Failed to add video.");
      }
    }
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await fetch(`${API_URL}/videos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const result = await response.json();
        alert(result.message || "Video deleted successfully!");

        // Remove the deleted video from the state
        setVideos((prev) => prev.filter((video) => video.id !== id));
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video.");
      }
    }
  };

  const renderLessonList = () => (
    <div className="lesson-list-container">
      <h1 className="page-title">Lessons & Video Tutorials</h1>
      <div className="lesson-grid">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="lesson-card"
            onClick={() => setSelectedLesson(lesson)}
          >
            <h3 className="lesson-title">
              Lesson {lesson.id}: {lesson.title}
            </h3>
          </div>
        ))}
      </div>
      {currentRole === "teacher" && (
        <div className="admin-section">
          <h2>Add New Lesson</h2>
          <input
            type="text"
            placeholder="Lesson Title"
            value={newLesson.title}
            onChange={(e) =>
              setNewLesson({ ...newLesson, title: e.target.value })
            }
            className="input-field"
          />
          <textarea
            placeholder="Lesson Description"
            value={newLesson.description}
            onChange={(e) =>
              setNewLesson({ ...newLesson, description: e.target.value })
            }
            className="input-field"
          />
          <button onClick={handleAddLesson} className="add-button">
            ➕ Add Lesson
          </button>
        </div>
      )}
    </div>
  );

  const renderLessonDetail = () => (
    <div className="lesson-page-layout">
      {/* Left Section: Lesson Details */}
      <div className="lesson-detail-container">
        <button className="back-button" onClick={() => setSelectedLesson(null)}>
          ←
        </button>
        <h2 className="lesson-detail-title">
          Lesson {selectedLesson.id}: {selectedLesson.title}
        </h2>
        <p className="lesson-detail-description">
          {selectedLesson.description}
        </p>
        
        {/* Edit Lesson Form - Styled Buttons */}
        {editLesson && (
          <div className="edit-lesson-form">
            <h3>Edit Lesson</h3>
            <input
              type="text"
              value={editLesson.title}
              onChange={(e) => setEditLesson({ ...editLesson, title: e.target.value })}
              className="input-field"
            />
            <textarea
              value={editLesson.description}
              onChange={(e) => setEditLesson({ ...editLesson, description: e.target.value })}
              className="input-field"
            />
            <div className="edit-button-container">
              <button onClick={handleEditLesson} className="save-button">
                💾 Save Changes
              </button>
              <button onClick={() => setEditLesson(null)} className="cancel-button">
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit and Add Buttons */}
        {currentRole === "teacher" && (
          <div className="button-container">
            <button
              className="edit-button-lesson"
              onClick={() => setEditLesson(selectedLesson)}
            >
              ✏️ Edit Lesson
            </button>
            <button
              className="delete-button-lesson"
              onClick={() => handleDeleteLesson(selectedLesson.id)}
            >
              🗑️ Delete Lesson
            </button>
            <button className="add-button" onClick={() => setIsModalOpen(true)}>
              ➕ Add Video
            </button>
          </div>
        )}
      </div>

     {/* Videos Section */}
      <div className="video-output-section">
        <h3 className="video-section-title">Videos</h3>
        <div className="video-grid-section">
          {videos
            .filter((video) => video.lesson && video.lesson.id === selectedLesson.id)
            .map((video) => (
              <div key={video.id} className="video-card">
                <h4 className="video-title">{video.title}</h4> {/* Add Video Title */}
                <iframe
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                {userRole !== "student" && (
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="delete-button"
                  >
                    🗑️ Delete Video
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Video</h2>
            <input
              type="text"
              placeholder="Video Title"
              value={newVideo.title}
              onChange={(e) =>
                setNewVideo({ ...newVideo,
                  title: e.target.value,
                })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="YouTube URL"
              value={newVideo.url}
              onChange={(e) =>
                setNewVideo({ ...newVideo, url: e.target.value })
              }
              className="input-field"
            />
            <button
              onClick={() => handleAddVideo(selectedLesson.id)}
              className="save-button"
            >
              Save
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="cancel-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="lessons-page-container">
      {selectedLesson ? renderLessonDetail() : renderLessonList()}
    </div>
  );
};

export default LessonsPage;