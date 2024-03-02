// import { GetFormById } from "@/actions/form";
// import FormBuilder from "@/components/FormBuilder";

import {  GetFormById } from "@/actions/form";
import Designer from "@/components/Designer";
import PreviewDialogBtn from "@/components/PreviewDialogBtn";
import PublishFormBtn from "@/components/PublishFormBtn";
import SaveFormBtn from "@/components/SaveFormBtn";
import { Input } from "@/components/ui/input";
import useDesigner from "@/hooks/useDesigner";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";


function BuilderPage() {
  const location = useLocation()
  const { setElements, setSelectedElement } = useDesigner();

  const params = new URLSearchParams(location.search).get('id')
  const [isReady, setIsReady] = React.useState(false);
  const [form, setForm] = React.useState<any>(null);



  useEffect(() => {
    const fetchForm = async () => {
      try {
        const result = await GetFormById(Number(params));
        setForm(result)
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    };

    fetchForm()
  }, [params])

  useEffect(() => {
    if (isReady) return;
    const elements =form?.content?form.content:[];
    setElements(elements);
    setSelectedElement(null);
    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout);
  }, [form, setElements, isReady, setSelectedElement]);
  const shareUrl = `${window.location.origin}/submit/${form}`;


  if (form?.published) {
    return (
      <>
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="max-w-md">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
              🎊🎊 Form Published 🎊🎊
            </h1>
            <h2 className="text-2xl">Share this form</h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              Anyone with the link can view and submit the form
            </h3>
            <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
              <Input className="w-full" readOnly value={shareUrl} />
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: "Copied!",
                    description: "Link copied to clipboard",
                  });
                }}
              >
                Copy link
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant={"link"} asChild>
                <Link to={"/"} className="gap-2">
                  <BsArrowLeft />
                  Go back home
                </Link>
              </Button>
              <Button variant={"link"} asChild>
                <Link to={`/forms/${form.id}`} className="gap-2">
                  Form details
                  <BsArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <main className="flex flex-col w-full">
      <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
        <h2 className="truncate font-medium">
          <span className="text-muted-foreground mr-2">Form:</span>
          {form?.name}
        </h2>
        <div className="flex items-center gap-2">
          <PreviewDialogBtn />
          {!form?.published && (
          <>
            <SaveFormBtn id={form?.id} />
            <PublishFormBtn id={form?.id}/>
          </>
          )}
        </div>
      </nav>
      <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
        <Designer />
      </div>
    </main>
  )
}

export default BuilderPage