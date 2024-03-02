

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";

function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-4">
      <h2 className="text-destructive text-4xl">Something went wrong!</h2>
      <Button asChild>
        <Link to={"/"}>Go back to home</Link>
      </Button>
    </div>
  );
}

export default ErrorPage;
