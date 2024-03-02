
import { cn } from "@/lib/utils";
import DesignerSidebar from "./DesignerSidebar";
import { Button } from "./ui/button";
import useDesigner from "@/hooks/useDesigner";
import { FormElements } from "@/types/FormElements";
import { FormElementInstance } from "@/types/FormElements";
import React from "react";
import { BiSolidTrash } from "react-icons/bi";



function Designer() {
    const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner();
    return (
        <div className="flex w-full h-full">
            <div className="p-4 w-full">
                <div className={cn(
                    "bg-background max-w-[1500px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto"
                )}

                >
                 {elements?.map((element) => (
                        <div className="flex flex-col w-full gap-2 p-2">
                            <DesignerElementWrapper element={element} />

                        </div>
                    ))} 

                </div>
            </div>
            <DesignerSidebar />
        </div>
    )


}
export default Designer;


function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
    const { removeElement, selectedElement, setSelectedElement } = useDesigner();

     const DesignerElement = FormElements[element.fieldType].designerComponent;
    const [mouseIsOver, setMouseIsOver] = React.useState<boolean>(false);


    return (
        <div
            className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element);
            }}

        >     <div className="absolute w-full h-1/2 rounded-t-md" />
            <div className="absolute  w-full bottom-0 h-1/2 rounded-b-md" />
            {mouseIsOver && (
                <>
                    <div className="absolute right-0 h-full">
                        <Button
                            className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
                            variant={"outline"}
                            onClick={(e) => {
                                e.stopPropagation(); // avoid selection of element while deleting
                                removeElement(element.id);
                            }}
                        >
                            <BiSolidTrash className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                        <p className="text-muted-foreground text-sm">Click for properties or Delete field</p>
                    </div>
                </>
            )}
            <div
                className={cn(
                    "flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100"
                )}
            >
                <DesignerElement elementInstance={element} />
            </div>


        </ div>
    )

}