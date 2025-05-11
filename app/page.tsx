import BankForm from "@/components/ui/BankForm";

export default function Home() {
  return (
    <div className="w-full max-w-[700px] px-4 mx-auto">
      <div className="mt-5">
        <h1 className="text-xl md:text-2xl font-bold text-center">Bank Marketing Prediction</h1>
        <p className="text-center mb-6">Fill in the details to predict if a client will subscribe to a term deposit</p>
        <BankForm/>
      </div>
    </div>
  );
}



