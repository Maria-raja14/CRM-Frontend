import { useState } from "react"; ///it is original..
import { Menu, Trash2, X } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tooltip } from "react-tooltip";

const ItemType = "SOCIAL_ITEM";
const socialNames = {
  facebook: "Facebook",
  twitter: "Twitter",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  reddit: "Reddit",
  pinterest: "Pinterest",
  snapchat: "Snapchat",
};

const initialLinks = Array(7)
  .fill(null)
  .map((_, i) => ({ id: i + 1, name: "", url: "" }));

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

  function extractSocialName(url) {
    try {
      const domain = new URL(url).hostname.replace("www.", "").toLowerCase();
      const domainParts = domain.split(".");

      // Use the main domain name instead of the full hostname
      const socialName =
        domainParts.length > 2 ? domainParts[1] : domainParts[0];

      return socialName.charAt(0).toUpperCase() + socialName.slice(1);
    } catch {
      return "Unknown Social Media";
    }
  }

  const handleAddUrl = () => {
    const name = extractSocialName(newUrl);
    updateUrl(index, newUrl, name);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewUrl(social.url);
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center justify-between p-3 rounded-lg transition ${
        isDragging ? "opacity-50" : " "
      }`}
    >
      <div className="flex items-center space-x-3">
        <Menu size={20} className="text-gray-500 cursor-pointer" />
        <SocialIcon url={social.url} style={{ height: 40, width: 40 }} />
        <span className="text-gray-800 font-medium">
          {social.name || "Social Media"}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {isEditing ? (
          <>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="border border-gray-300 rounded-lg p-1"
              placeholder="Enter URL"
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded-lg"
              onClick={handleAddUrl}
            >
              Add
            </button>
            <X
              size={22}
              className="text-gray-400 cursor-pointer"
              onClick={handleCancel}
            />
          </>
        ) : social.url ? (
          <div className="flex items-center justify-between w-full">
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 truncate"
            >
              {social.url}
            </a>
            <Trash2
              size={22}
              className="text-gray-400 cursor-pointer ml-4"
              onClick={() => removeUrl(index)}
            />
            <Tooltip
              id={`tooltip-${social.id}`}
              place="top"
              content={social.url}
            />
          </div>
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded-lg"
            onClick={() => setIsEditing(true)}
          >
            Link
          </button>
        )}
      </div>
    </div>
  );
}

export default function SocialLinks() {
  const [socialLinks, setSocialLinks] = useState(initialLinks);

  const moveItem = (fromIndex, toIndex) => {
    const updatedLinks = [...socialLinks];
    const [movedItem] = updatedLinks.splice(fromIndex, 1);
    updatedLinks.splice(toIndex, 0, movedItem);
    setSocialLinks(updatedLinks);
  };

  const updateUrl = (index, url, name) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], url, name };
    setSocialLinks(updatedLinks);
  };

  const removeUrl = (index) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], url: "", name: "" };
    setSocialLinks(updatedLinks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full mx-auto p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Social Links</h2>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="space-y-4">
          {socialLinks.map((social, index) => (
            <DraggableItem
              key={social.id}
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
