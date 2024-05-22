import { LoaderCircle } from "lucide-react"

const loading = () => {
  return (
    <div className='relative w-full min-h-[80vmin] flex items-center justify-center'>
      <LoaderCircle className='animate-[spin_1s_linear_infinite] text-muted-foreground h-auto w-[5%]' />
    </div>
  )
}

export default loading
