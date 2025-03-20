import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function PlayWright() {
  return (
    <>
      <Card className="w-2/3">
        <CardHeader className="text-center">
          <CardTitle>PlayWright Initiated</CardTitle>
          <CardDescription>Please do not close this tab.</CardDescription>
        </CardHeader>
        <CardContent>
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>To be done</CardTitle>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    </>
  );
}
