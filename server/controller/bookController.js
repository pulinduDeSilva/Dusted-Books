const cloudinary = require("../config/cloudinary");
const Book = require("../model/book");

exports.BookUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, author, description, price } = req.body;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "Book_Images",
        transformation: [
            { width: 300, height: 400, crop: "limit" },
          { quality: "auto" },
        ],
      }
      ,
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error });
        }
        try{
            const newBook = await Book.create({
                title,
                author,
                description,
                price,
                imgUrl: result.secure_url,
            });
            res.status(201).json(newBook);
        } catch (dbErr) {
            res.status(500).json({ error: dbErr.message });
        }
        
      },
    );
    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
