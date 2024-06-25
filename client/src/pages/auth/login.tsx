import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import React from "react";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: Yup.string().required("Password is required"),
});

const defaultValues = {
  email: "jackson@example.com",
  password: "123456",
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://your-api-endpoint/login", data);
      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.message ? error.message : "Server error, Please try again!"
      );
      reset();
    } finally {
      reset();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="text"
                    id="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                {/* Toast */}
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                  // <div
                  //   className="toast align-items-center text-white bg-primary border-0"
                  //   role="alert"
                  //   aria-live="assertive"
                  //   aria-atomic="true"
                  // >
                  //   <div className="d-flex">
                  //     <div className="toast-body">{errorMessage}</div>
                  //     <button
                  //       type="button"
                  //       className="btn-close btn-close-white me-2 m-auto"
                  //       data-bs-dismiss="toast"
                  //       aria-label="Close"
                  //     ></button>
                  //   </div>
                  // </div>
                )}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
