import React, { useState } from "react";
import useDesigner from "@/hooks/useDesigner";
import { FormElements } from "@/types/FormElements";
import { AiOutlineClose } from "react-icons/ai";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

function PropertiesFormSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner();
  const [isEditing, setIsEditing] = useState(false);

  if (!selectedElement) return null;

  const PropertiesForm = FormElements[selectedElement?.fieldType].propertiesComponent;

  const handleSaveChanges = (updatedProperties) => {
    // Update the selected element with the new properties
    setSelectedElement({ ...selectedElement, ...updatedProperties });
    // Set isEditing back to false
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/70">Element properties</p>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            setSelectedElement(null);
          }}
        >
          <AiOutlineClose />
        </Button>
      </div>
      <Separator className="mb-4" />
      {isEditing ? (
        <div>
          {/* Render input fields for each property and an "Enter" button */}
          <PropertiesForm
            elementInstance={selectedElement}
            onChange={(updatedProperties) => {
              // Update the properties state variable
              setSelectedElement({ ...selectedElement, ...updatedProperties });
            }}
          />
          {/* <Button onClick={() => handleSaveChanges(selectedElement)}>
            Save Changes
          </Button> */}
        </div>
      ) : (
        <PropertiesForm elementInstance={selectedElement} />
      )}
      <Button className="m-6" onClick={() => setIsEditing(true)}>Save</Button>
    </div>
  );
}

export default PropertiesFormSidebar;