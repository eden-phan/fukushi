import { cn } from "@/lib/utils"
import Image from "next/image"

function UIStatCardHeader({
    className,
    color,
    icon,
    ...props
}: React.ComponentProps<"div"> & { color: string; icon: React.ReactNode | string }) {
    return (
        <div data-slot="statCardHeader" className={cn("text-2xl font-bold", className)} {...props}>
            <div
                className={`flex flex-col justify-center items-center border-b h-32`}
                style={{ backgroundColor: color }}
            >
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 flex items-center justify-center">
                        {typeof icon === "string" ? (
                            <Image
                                src={icon}
                                alt="icon"
                                width={48}
                                height={48}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
                        )}
                    </div>
                </div>
                <div className="pb-3 text-2xl text-white font-bold text-center">{props.children}</div>
            </div>
        </div>
    )
}

function UIStatCardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="statCardContent"
            className={cn("text-lg bg-white font-semibold h-20 flex items-center justify-center", className)}
            {...props}
        >
            <p className="text-3xl font-bold text-center">{props.children}</p>
        </div>
    )
}

function UIStatCard({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="statCard"
            className={cn(
                "bg-accent rounded-md overflow-hidden shadow-md w-full sm:w-auto sm:flex-1 sm:min-w-0",
                className
            )}
            {...props}
        ></div>
    )
}

function UIStatCardGroup({ className, children }: React.ComponentProps<"div"> & { children: React.ReactNode }) {
    return (
        <div
            data-slot="statCardGroup"
            className={cn("grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16", className)}
        >
            {children}
        </div>
    )
}

export { UIStatCard, UIStatCardHeader, UIStatCardContent, UIStatCardGroup }
