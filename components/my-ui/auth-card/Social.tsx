import { loginWithOAuth } from "@/lib/actions/user"

import { FaGoogle } from "react-icons/fa"
import { FaGithub } from "react-icons/fa"

import { Button } from "@/components/ui/button"

const Social = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Button
        variant="outline"
        onClick={async () => await loginWithOAuth("github")}
      >
        <FaGithub className="mr-2 h-4 w-4" />
        Github
      </Button>
      <Button
        variant="outline"
        onClick={async () => await loginWithOAuth("google")}
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  )
}

export default Social

