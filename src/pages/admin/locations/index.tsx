import AdminLayout from '@/components/AdminLayout'

export default function Index() {
  return (
    <AdminLayout header={
      <div>
        <h1 className="font-bold text-2xl text-text">LOCATIONS</h1>
      </div>
    }>
      <div className='w-full h-full flex flex-col gap-2 bg-foreground'>
        <div>
          <h1 className='font-bold'>Location Configuration Coming Soon</h1>
        </div>
      </div>
    </AdminLayout>
  )
}