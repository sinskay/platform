import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { CategoryForm } from "./_components/category-form";
import { Separator } from "@/components/ui/separator";
import { AttachmentForm } from "./_components/attachment-form";
const GuidesIdPage = async ({
  params
}: {
  params: { guideId: string }
}) => {
  // get user ID
  const session = auth()

  // check if user is logged in
  if (!session) {
    return redirect('/')
  }

  // get guide
  const guide = await db.guide.findUnique({
    where: {
      id: params.guideId
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  // if no guide, redirect to home
  if (!guide) {
    return redirect('/')
  }

  // array of required fields
  const requiredFields = [
    guide.title,
    guide.description,
    guide.imageUrl,
    guide.price,
    guide.categoryId
  ];

  // categories
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    }
  })
  // Get Total Fields
  const totalFields = requiredFields.length;
  // total that dont equal false
  const completedFields = requiredFields.filter(Boolean).length
  // completion text
  const completionText = `(${completedFields}/${totalFields})`
  // check if all fields are complete
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      {/* Title */}
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold">
            Guide Setup
          </h1>
          {/* Amount Complete */}
          <span className="text-sm text-slate-300">
            {completionText} Complete
          </span>
          <div className='flex items-center justify-center'>
            <Separator className='w-20 h-0.5 rounded bg-slate-200 mt-3'/>
          </div>
        </div>
        
      </div>
      <div className="mt-16">
        <div className="text-center">
            {/* Customize Guide */}
            <h2 className="text-3xl font-bold">
              Customize Course
            </h2>

            <div className='flex items-center justify-center'>
                <Separator className='w-20 h-0.5 rounded bg-slate-200 mt-3'/>
            </div>
            
            {/* Guide TItle */}
            <TitleForm
              initialData={guide}
              guideId={guide.id}
            />

            {/* Description Form */}
            <DescriptionForm
              initialData={guide}
              guideId={guide.id}
            />

            {/*Image Form*/}
            <ImageForm
              initialData={guide}
              guideId={guide.id}
            />

            {/* Categories */}
            <CategoryForm
              initialData={guide}
              guideId={guide.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />


            {/* Chapters */}
            <div className="text-center mt-12">
              <h2 className="text-3xl font-bold">
                Guide chapters
              </h2>
            </div> 
          
          
          {/* Price */}
          
          <PriceForm initialData={guide} guideId={guide.id}/>

          {/* Attachments */}
          <AttachmentForm
            initialData={guide}
            guideId={guide.id}
          />
          
        </div>
      </div>
    </div>
  );
}
export default GuidesIdPage;