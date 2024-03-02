import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "@/hooks/useDesigner";
import { UpdateFormContent } from "@/actions/form";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  //Form cannot be saved as it is empty
  const updateFormContent = async () => {
    if (elements.length === 0) {
      toast({
        title: "Error",
        description: "Form cannot be saved as it is empty.",
        variant: "destructive",
      });
      return;
    }
//saved
    try {
      const jsonElements = JSON.stringify(elements);

      await UpdateFormContent(id, elements);
      toast({
        title: "Success",
        description: "Your form has been saved",
      });
    } catch (error) {
      toast({                 //error while saved
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        updateFormContent();
      }}
    >
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;