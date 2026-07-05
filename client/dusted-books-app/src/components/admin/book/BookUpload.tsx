import React, { useState } from "react";



export default function BookUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>(""); 

  const [status, setStatus] = useState<{ type: string; message: string }>({ 
    type: "", 
    message: "" 
  });

  // handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setImage(null);
      setPreview("");
      return;
    }

    setImage(file);

    // preview before upload
    setPreview(URL.createObjectURL(file));
  };

  

  // upload to backend
  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/books/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const responseText = await res.text();
      if (!res.ok) {
        throw new Error(
          responseText || `Upload failed with status ${res.status}`,
        );
      }

      setStatus({ type: "success", message: "Book uploaded successfully!" });
      setImage(null);
      setPreview("");
      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");

    } catch (err) {
      console.log("Upload error:", err);
      setStatus({ type: "error", message: "Failed to upload book." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleUpload();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto mt-10 xl:mt-20 flex w-full max-w-2xl flex-col items-center J px-2 text-sm sm:px-0">
        <h1 className="pb-4 mb-5 text-center text-2xl font-semibold text-slate-700">
          Add a Book
        </h1>

        <div className="flex w-full flex-col items-stretch gap-8 md:flex-row md:items-center">
          <div className="w-full">
            <label className="text-black/70" htmlFor="title">
              Title
            </label>
            <input
              className="h-8 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300"
              type="text"
              placeholder="Enter book title"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label className="text-black/70" htmlFor="author">
              Author
            </label>
            <input
              className="h-8 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300"
              type="text"
              placeholder="Enter author name"
              id="author"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 w-full">
          <label className="text-black/70" htmlFor="description">
            Description
          </label>
          <textarea
            className="w-full mt-2 p-2 h-40 border border-gray-500/30 rounded resize-none outline-none focus:border-indigo-300"
            id="description"
            placeholder="Enter book description..."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div className="w-full mt-5">
            <label className="text-black/70" htmlFor="price">
              Price
            </label>
            <input
              className="h-8 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300"
              type="text"
              placeholder="Enter price in LKR"
              id="price"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        
        {/* img upload */}
        <div style={{ padding: "20px" }} className="mt-6 flex w-full flex-col gap-6 rounded-lg bg-zinc-100/50 sm:flex-row items-center justify-between">
                    
          <div className="flex w-full items-center justify-center ">
            <label htmlFor="dropzone-file" className="flex h-64 w-full flex-col items-center justify-center rounded-base bg-neutral-secondary-medium cursor-pointer hover:bg-neutral-tertiary-medium">
                  <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/></svg>
                      <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input id="dropzone-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" key={image ? image.name : "empty"}/>
              </label>
          </div> 

            

            {/* preview */}
            {preview && (
              <div className="flex w-full items-center justify-center sm:w-1/3">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-w-[150px] rounded-md object-cover"
                />
              </div>
            )}

          
        </div>
        <div>
          <h1 className={`text-lg font-base m-7 ${status.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {status.message}
          </h1>
        </div>
        <button type="submit" disabled={loading} className="mt-2 rounded bg-black px-5 py-2.5 text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Adding..." : "Add"}
          </button>
      </form>
    </>
  );
}
