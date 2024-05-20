"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import Header from "./Header";
import Social from "./Social";
import BackButton from "./BackButton";

interface authenticationCardProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}
const AuthenticationCard = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: authenticationCardProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial &&
        <div className="p-6 pt-0">
          <Social />
        </div>
      }
      <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  )
}

export default AuthenticationCard

