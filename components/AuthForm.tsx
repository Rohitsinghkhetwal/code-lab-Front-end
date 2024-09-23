"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authformSchema } from "@/lib/utils";
import CustomInput from "./CustomInput";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"
import {Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import Cookies from "js-cookie"

const AuthForm = ({ type }: { type: string }) => {

  const router = useRouter();

  //declaring the hooks
  const [loading, setloading] = useState(false);
  const formSchema = authformSchema(type);
  const [user, setuser] = useState<any>(null);


  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setloading(true);
    try {
      if (type === "sign-up") {
        const signUpurl = 'http://localhost:9000/api/v1/users/sign-up'
        const result = await axios.post(signUpurl, {
          email: values.email,
          password: values.password,
          username: values.username
        });
        console.log("this is the result", result);
        setuser(result);
        toast.success("Sign up Successfully !")
      }

      if(type === "sign-in") {
        const signInUrl = 'http://localhost:9000/api/v1/users/login';
        const res = await axios.post(signInUrl, {
          email: values.email,
          password: values.password,
        })
        if(res.status === 200) {
          Cookies.set('refreshToken', res.data.refreshToken, {secure: true, sameSite: 'Strict'})
          router.push("/")
          toast.success("Sign in successfully !")
        }
        console.log("this is the res", res);
        
      }
    } catch (err) {
      toast.error("Server error !")
      console.log(err);
    } finally {
      setloading(false)
    }
  };

  return (
    <section className="flex min-h-screen w-full max-w-[700px] flex-col justify-center items-center gap-5 py-10 md:gap-8 ">
      <div className="flex flex-col gap-1 md:gap-3">
        <h3 className="text-slate-700 text-2xl font-bold">
          {type === "sign-in" ? "Sign In" : "Sign up"}
        </h3>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10 w-full px-6 md:ml-[45px]"
        >
          {type === "sign-up" && (
            <div className="flex w-full flex-col">
              <CustomInput
                control={form.control}
                label="Username"
                placeholder="Enter the username"
                name="username"
              />
            </div>
          )}

          <CustomInput
            control={form.control}
            label="Email"
            placeholder="Enter your Email"
            name="email"
          />

          <CustomInput
            control={form.control}
            label="Password"
            placeholder="Enter the password"
            name="password"
          />
          <div className="flex flex-col w-full">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                <Loader2 className="animate-spin" size={20}/>
                &nbsp; Loading...
                </>
              ): type === "sign-up" ? (
                "Sign-up"
              ): (
                "Sign-in"
              )}
            </Button>
          </div>
        </form>

        {/* footer section here */}
        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-slate-900">
            {type === "sign-in"
              ? "Don't have account ?"
              : "Already have an account"}
          </p>
          <Link
            className="text-14 cursor-pointer font-medium text-slate-800"
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
          >
            {type === "sign-in" ? "Sign-up" : "Sign-in"}
          </Link>
        </footer>
      </Form>
    </section>
  );
};

export default AuthForm;
