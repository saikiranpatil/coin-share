import AddTransactionPage from '@/components/transactions/add-transaction/AddTransactionPage'

const AddGroupTransaction = ({ params: { groupId } }: { params: GroupPageProps }) => <AddTransactionPage groupId={groupId} />
export default AddGroupTransaction