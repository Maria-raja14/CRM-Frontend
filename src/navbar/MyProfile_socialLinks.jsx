// <<<<<<< HEAD
// import { useState, useEffect, useCallback } from "react";
// import { Menu, Trash2, X, PlusCircle } from "lucide-react";
// =======
// import { useState } from "react"; ///it is original..
// import { Menu, Trash2, X } from "lucide-react";
// >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// import { SocialIcon } from "react-social-icons";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import axios from "axios";

// const ItemType = "SOCIAL_ITEM";

// function extractDomain(url) {
//   try {
//     const hostname = new URL(url).hostname;
//     return hostname.replace("www.", "");
//   } catch {
//     return "Social Media";
//   }
// }

// function DraggableItem({ social, index, moveItem, updateUrl, removeUrl }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [newUrl, setNewUrl] = useState(social.url);

//   const [{ isDragging }, drag] = useDrag({
//     type: ItemType,
//     item: { index },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: ItemType,
//     hover: (draggedItem) => {
//       if (draggedItem.index !== index) {
//         moveItem(draggedItem.index, index);
//         draggedItem.index = index;
//       }
//     },
//   });

// <<<<<<< HEAD
//   const handleUpdateUrl = () => {
//     updateUrl(social._id, newUrl);
// =======
//   function extractSocialName(url) {
//     try {
//       const domain = new URL(url).hostname.replace("www.", "").toLowerCase();
//       const domainParts = domain.split(".");

//       // Use the main domain name instead of the full hostname
//       const socialName =
//         domainParts.length > 2 ? domainParts[1] : domainParts[0];

//       return socialName.charAt(0).toUpperCase() + socialName.slice(1);
//     } catch {
//       return "Unknown Social Media";
//     }
//   }

//   const handleAddUrl = () => {
//     const name = extractSocialName(newUrl);
//     updateUrl(index, newUrl, name);
// >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
//     setIsEditing(false);
//   };

//   return (
// <<<<<<< HEAD
//     <div ref={(node) => drag(drop(node))} className={`flex items-center justify-between p-4 transition ${isDragging ? "opacity-50" : ""}`}>
//       <div className="flex items-center space-x-3">
//         <Menu size={20} className="text-gray-500 cursor-pointer" />
//         <SocialIcon url={social.url} style={{ height: 40, width: 40 }} />
//         <span className="text-gray-800 font-medium">{extractDomain(social.url)}</span>
// =======
//     <div
//       ref={(node) => drag(drop(node))}
//       className={`flex items-center justify-between p-3 rounded-lg transition ${
//         isDragging ? "opacity-50" : " "
//       }`}
//     >
//       <div className="flex items-center space-x-3">
//         <Menu size={20} className="text-gray-500 cursor-pointer" />
//         <SocialIcon url={social.url} style={{ height: 40, width: 40 }} />
//         <span className="text-gray-800 font-medium">
//           {social.name || "Social Media"}
//         </span>
// >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
//       </div>
//       <div className="flex items-center space-x-4">
//         {isEditing ? (
//           <>
//             <input
//               type="text"
//               value={newUrl}
//               onChange={(e) => setNewUrl(e.target.value)}
// <<<<<<< HEAD
//               className="border border-gray-300 rounded-lg p-2 w-60"
//               placeholder="Enter URL"
//             />
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={handleUpdateUrl}>
//               Save
//             </button>
//             <X size={22} className="text-gray-400 cursor-pointer" onClick={() => setIsEditing(false)} />
//           </>
//         ) : (
//           <>
//             <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs">
//               {social.url}
//             </a>
//             <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full" onClick={() => setIsEditing(true)}>✏️</button>
//             <Trash2 size={22} className="text-red-500 cursor-pointer hover:text-red-600" onClick={() => removeUrl(social._id)} />
//           </>
// =======
//               className="border border-gray-300 rounded-lg p-1"
//               placeholder="Enter URL"
//             />
//             <button
//               className="bg-blue-600 text-white px-4 py-1 rounded-lg"
//               onClick={handleAddUrl}
//             >
//               Add
//             </button>
//             <X
//               size={22}
//               className="text-gray-400 cursor-pointer"
//               onClick={handleCancel}
//             />
//           </>
//         ) : social.url ? (
//           <div className="flex items-center justify-between w-full">
//             <a
//               href={social.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 truncate"
//             >
//               {social.url}
//             </a>
//             <Trash2
//               size={22}
//               className="text-gray-400 cursor-pointer ml-4"
//               onClick={() => removeUrl(index)}
//             />
//             <Tooltip
//               id={`tooltip-${social.id}`}
//               place="top"
//               content={social.url}
//             />
//           </div>
//         ) : (
//           <button
//             className="bg-blue-600 text-white px-4 py-1 rounded-lg"
//             onClick={() => setIsEditing(true)}
//           >
//             Link
//           </button>
// >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
//         )}
//       </div>
//     </div>
//   );
// }

// export default function SocialLinks() {
//   const [socialLinks, setSocialLinks] = useState([]);
//   const [newLink, setNewLink] = useState("");

//   useEffect(() => {
//     fetchSocialLinks();
//   }, []);

//   const fetchSocialLinks = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:5000/api/social-links");
//       setSocialLinks(data);
//     } catch (error) {
//       console.error("Error fetching social links", error);
//     }
//   };

//   const moveItem = useCallback((fromIndex, toIndex) => {
//     setSocialLinks((prevLinks) => {
//       const updatedLinks = [...prevLinks];
//       const [movedItem] = updatedLinks.splice(fromIndex, 1);
//       updatedLinks.splice(toIndex, 0, movedItem);
//       return updatedLinks;
//     });
//   }, []);

//   const addSocialLink = async () => {
//     if (!newLink.trim()) return;
//     try {
//       const newName = extractDomain(newLink);
//       const { data } = await axios.post("http://localhost:5000/api/social-links", { name: newName, url: newLink });
//       setSocialLinks([...socialLinks, data]);
//       setNewLink("");
//     } catch (error) {
//       console.error("Error adding social link", error);
//     }
//   };

//   const updateUrl = async (id, url) => {
//     try {
//       const newName = extractDomain(url);
//       const { data } = await axios.put(`http://localhost:5000/api/social-links/${id}`, { url, name: newName });
//       setSocialLinks(socialLinks.map((link) => (link._id === id ? data : link)));
//     } catch (error) {
//       console.error("Error updating social link", error);
//     }
//   };

//   const removeUrl = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/social-links/${id}`);
//       setSocialLinks(socialLinks.filter((link) => link._id !== id));
//     } catch (error) {
//       console.error("Error deleting social link", error);
//     }
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="w-full mx-auto max-w-xl">
//         <h2 className="text-2xl font-semibold mb-4  mr-10">Social Links</h2>
//         <div className="flex space-x-3 mb-6">
//           <input
//             type="text"
//             value={newLink}
//             onChange={(e) => setNewLink(e.target.value)}
//             placeholder="Enter new URL"
//             className="border border-gray-300 rounded-lg p-2 w-full"
//           />
//           <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2" onClick={addSocialLink}>
//             <PlusCircle size={20} />
//             <span>Add</span>
//           </button>
//         </div>
//         <div className="space-y-4">
//           {socialLinks.map((social, index) => (
//             <DraggableItem key={social._id} social={social} index={index} moveItem={moveItem} updateUrl={updateUrl} removeUrl={removeUrl} />
//           ))}
//         </div>
//       </div>
//     </DndProvider>
//   );
// }


import { useState, useEffect, useCallback } from "react";
import { Menu, Trash2, X, PlusCircle } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

const ItemType = "SOCIAL_ITEM";

function extractDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace("www.", "");
  } catch {
    return "Social Media";
  }
}

function DraggableItem({ social, index, moveItem, updateUrl, removeUrl }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(social.url);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleUpdateUrl = () => {
    if (!newUrl.trim()) return;
    updateUrl(social._id, newUrl);
    setIsEditing(false);
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center justify-between p-4 transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <Menu size={20} className="text-gray-500 cursor-pointer" />
        <SocialIcon url={social.url} style={{ height: 40, width: 40 }} />
        <span className="text-gray-800 font-medium">
          {extractDomain(social.url)}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {isEditing ? (
          <>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-60"
              placeholder="Enter URL"
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleUpdateUrl}
            >
              Save
            </button>
            <X
              size={22}
              className="text-gray-400 cursor-pointer"
              onClick={() => setIsEditing(false)}
            />
          </>
        ) : (
          <>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate max-w-xs"
            >
              {social.url}
            </a>
            <button
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
              onClick={() => setIsEditing(true)}
            >
              ✏️
            </button>
            <Trash2
              size={22}
              className="text-red-500 cursor-pointer hover:text-red-600"
              onClick={() => removeUrl(social._id)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function SocialLinks() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [newLink, setNewLink] = useState("");

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/social-links");
      setSocialLinks(data);
    } catch (error) {
      console.error("Error fetching social links", error);
    }
  };

  const moveItem = useCallback((fromIndex, toIndex) => {
    setSocialLinks((prevLinks) => {
      const updatedLinks = [...prevLinks];
      const [movedItem] = updatedLinks.splice(fromIndex, 1);
      updatedLinks.splice(toIndex, 0, movedItem);
      return updatedLinks;
    });
  }, []);

  const addSocialLink = async () => {
    if (!newLink.trim()) return;
    try {
      const newName = extractDomain(newLink);
      const { data } = await axios.post("http://localhost:5000/api/social-links", {
        name: newName,
        url: newLink,
      });
      setSocialLinks([...socialLinks, data]);
      setNewLink("");
    } catch (error) {
      console.error("Error adding social link", error);
    }
  };

  const updateUrl = async (id, url) => {
    try {
      const newName = extractDomain(url);
      const { data } = await axios.put(`http://localhost:5000/api/social-links/${id}`, {
        url,
        name: newName,
      });
      setSocialLinks(socialLinks.map((link) => (link._id === id ? data : link)));
    } catch (error) {
      console.error("Error updating social link", error);
    }
  };

  const removeUrl = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/social-links/${id}`);
      setSocialLinks(socialLinks.filter((link) => link._id !== id));
    } catch (error) {
      console.error("Error deleting social link", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full mx-auto max-w-xl">
        <h2 className="text-2xl font-semibold mb-4 mr-10">Social Links</h2>
        <div className="flex space-x-3 mb-6">
          <input
            type="text"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            placeholder="Enter new URL"
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            onClick={addSocialLink}
          >
            <PlusCircle size={20} />
            <span>Add</span>
          </button>
        </div>
        <div className="space-y-4">
          {socialLinks.map((social, index) => (
            <DraggableItem
              key={social._id}
              social={social}
              index={index}
              moveItem={moveItem}
              updateUrl={updateUrl}
              removeUrl={removeUrl}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
