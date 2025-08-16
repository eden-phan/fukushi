import { cn } from "@/lib/utils";
import Image from "next/image";

function UICard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-white rounded-md overflow-hidden shadow-md w-full sm:w-auto sm:flex-1 sm:min-w-0 p-8 space-y-4",
        className
      )}
      {...props}
    ></div>
  );
}

function UICardHeader({
  className,
  icon,
  ...props
}: React.ComponentProps<"div"> & { icon?: React.ReactNode | string }) {
  return (
    <div
      data-slot="cardHeader"
      className={cn(
        "text-2xl font-bold flex flex-row items-center flex-wrap gap-2",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex items-center">
          {typeof icon === "string" ? (
            <Image
              src={icon}
              alt="icon"
              width={20}
              height={20}
              className="w-8 h-8"
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      )}
      {props.children}
    </div>
  );
}

function UICardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cardContent"
      className={cn("text-lg bg-accent p-4 rounded-md", className)}
      {...props}
    >
      {props.children}
    </div>
  );
}

function UICardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cardFooter"
      className={cn("text-sm text-gray-500", className)}
      {...props}
    >
      {props.children}
    </div>
  );
}

export { UICard, UICardHeader, UICardContent, UICardFooter };
