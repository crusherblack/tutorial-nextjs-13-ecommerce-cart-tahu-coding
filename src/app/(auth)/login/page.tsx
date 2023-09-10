import Form from "./form";

export default async function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full md:w-8/12 lg:w-4/12 md:px-8 py-10">
        <Form />
      </div>
    </div>
  );
}
