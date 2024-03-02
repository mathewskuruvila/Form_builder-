import { GetForms } from "@/actions/form";
import CreateFormBtn from "../components/CreateFormBtn"
import { Separator } from "../components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { LuView } from "react-icons/lu";
import { FaEdit, FaWpforms } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BiRightArrowAlt } from "react-icons/bi";
import { Badge } from "@/components/ui/badge";
import React, { useEffect } from "react";
interface Form {
    name: string,
    published: false,
    createdAt: any,
    visits: string,
    submissions: string,
    description: string,
    id: number
}
export default function Home() {
    return (
        <div className="container pt-4">

            <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
            <Separator className="my-6" />
            <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CreateFormBtn />
                <FormCard />
            </div>
        </div>
    )
}

function FormCard() {
    const [forms, setForms] = React.useState<any>([]);
    useEffect(() => {
        const fetchForms = async () => {
            try {
                const forms = await GetForms();
                setForms(forms);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        fetchForms();
    }, [])
    return (
        <>
            {forms.map((form: Form) => (
                <Card key={form.id}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 justify-between">
                            <span className="truncate font-bold">{form.name}</span>
                            {form.published && <Badge>Published</Badge>}
                            {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
                        </CardTitle>
                        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
                            {/* {formatDistance(form.createdAt, new Date(), {
              addSuffix: true,
            })} */}
                            {form.published && (
                                <span className="flex items-center gap-2">
                                    <LuView className="text-muted-foreground" />
                                    {/* <span>{form.visits.toLocaleString()}</span> */}
                                    <FaWpforms className="text-muted-foreground" />
                                    {/* <span>{form.submissions.toLocaleString()}</span> */}
                                </span>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
                        {form.description || "No description"}
                    </CardContent>
                    <CardFooter>
                        {form.published && (
                            <Button asChild className="w-full mt-2 text-md gap-4">
                                <Link to={`/form?id=${form.id}`}>
                                    View submissions <BiRightArrowAlt />
                                </Link>
                            </Button>
                        )}
                        {!form.published && (
                            <Button asChild variant={"secondary"} className="w-full mt-2 text-md gap-4">
                                <Link to={`/builder?id=${form.id}`}>
                                    Edit form <FaEdit />
                                </Link>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}
