import nextConnect from 'next-connect';
import multer from 'multer';
import crypto from 'crypto';

const hasher = crypto.createHmac("sha256", process.env.SHA_SECRET || "test secret");

// Returns a Multer instance that provides several methods for generating 
// middleware that process files uploaded in multipart/form-data format.
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      console.log(file);
      const hash = hasher.update(file.buffer.buffer).digest('hex');
      let filename = `${hash}.${file.mimetype}`;
      req[file.filename] = filename;
      return cb(null, filename);
    },
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Adds the middleware to Next-Connect
apiRoute.use(upload.single('compFiles'));
apiRoute.use(upload.single("writeUpFile"));

// Process a POST request
apiRoute.post((req, res) => {
  console.log(req["compFiles"]);
  console.log(req["writeUpFile"]);
  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};