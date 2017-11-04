import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.UUID;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;

public class S3 {
     private final DLCUtil dlcutil = new DLCUtil(true);
     boolean debug = true;
     AmazonS3Client s3;
     String aws_env = "DLCDASHBOARD";
     String aws_reg = "W1";
     String bucketName = "dlcdashboard";
     String key = "configurationobject";

     public S3() {
          super();
          // DLCConnect cn = new DLCConnect();
          // s3 = cn.ConnectS3(aws_env, aws_reg);
     }
     public S3(String e,String r,String b, String k) {
          super();
          this.aws_env = e;
          this.aws_reg = r;
          this.bucketName = b;
          this.key = k;
          DLCConnect cn = new DLCConnect();
          s3 = cn.ConnectS3(aws_env, aws_reg);
     }
     public S3(String e,String r,String b, String k,String text) {
          super();
          this.aws_env    = e;
          this.aws_reg    = r;
          this.bucketName = b;
          this.key        = k;
          DLCConnect cn = new DLCConnect();
          s3 = cn.ConnectS3(aws_env, aws_reg);
          try {
              s3.putObject(new PutObjectRequest(bucketName, key, createObjectFile(text)));
              dlcutil.sysOut(key,this.get());
              this.list();
          } catch (Exception ex) {
              dlcutil.basicExceptionHandling(ex); 
          }
     }
     public S3(String sz) {
          super();
          DLCConnect cn = new DLCConnect();
          s3 = cn.ConnectS3(aws_env, aws_reg);
          try {
              s3.putObject(new PutObjectRequest(bucketName, key, createObjectFile(sz)));
              dlcutil.sysOut(key, this.get());
              this.list();
          } catch (Exception ex) {
              dlcutil.basicExceptionHandling(ex); 
          }
     }
     public S3(String sz, String objectKey) {
          super();
          DLCConnect cn = new DLCConnect();
          s3 = cn.ConnectS3(aws_env, aws_reg);
          try {
              s3.putObject(new PutObjectRequest(bucketName, objectKey, createObjectFile(sz)));
              dlcutil.sysOut(key, this.get());
              this.list();
          } catch (Exception ex) {
              dlcutil.basicExceptionHandling(ex); 
          }
     }
     public void setEnv(String sz)         { this.aws_env = sz; }
     public void setReg(String sz)         { this.aws_reg = sz; }
     public void setBucketName(String sz)  { this.bucketName = sz; }
     public void setKey(String sz)         { this.key = sz; }
     public void debug_on()                { this.debug = true; }
     public void debugon()                 { this.debug = true; }
     public void debugoff()                { this.debug = false; }
     public void debug_off()               { this.debug = false; }
     public void debug(boolean b)          { this.debug = b; }

     public AmazonS3Client connect() {
          DLCConnect cn = new DLCConnect();
          this.s3 = cn.ConnectS3(this.aws_env, this.aws_reg);
          return(this.s3);
     }

     public void put(String sz, String objectKey) {
          try {
               s3.putObject(new PutObjectRequest(bucketName, objectKey, createObjectFile(sz)));
           } catch (Exception e) {
               dlcutil.basicExceptionHandling(e); 
           }
     }
     public void put(String sz) {
        try {
            s3.putObject(new PutObjectRequest(bucketName, key, createObjectFile(sz)));
        } catch (Exception e) {
            dlcutil.basicExceptionHandling(e); 
        }
     }
     public String get(String objectKey) {
        String szRet= "";
        try {
            S3Object object = s3.getObject(new GetObjectRequest(bucketName, objectKey));
            szRet = getTextInputStream(object.getObjectContent());
        } catch (Exception e) {
            dlcutil.basicExceptionHandling(e); 
        }
        return(szRet);   
     }
     public String get() {
        String szRet= "";
        try {
            S3Object object = s3.getObject(new GetObjectRequest(bucketName, key));
            // "Content-Type: "  + object.getObjectMetadata().getContentType());
            szRet = getTextInputStream(object.getObjectContent());
        } catch (Exception e) {
            dlcutil.basicExceptionHandling(e); 
        }
        return(szRet);   
     }

     public void list() {
            dlcutil.sysOut("Listing buckets");
            for (Bucket bucket : s3.listBuckets()) {
                dlcutil.sysOut(" - " + bucket.getName());
            }
            dlcutil.sysOut("");
            ObjectListing objectListing = s3.listObjects(new ListObjectsRequest()
                    .withBucketName(this.bucketName));
            for (S3ObjectSummary objectSummary : objectListing.getObjectSummaries()) {
                dlcutil.sysOut(" - " + objectSummary.getKey() + "  " + "(size = " + objectSummary.getSize() + ")");
            }
     }


     public void remove() {
            s3.deleteObject(bucketName, key);
     }
     public void remove(String objectKey) {
            s3.deleteObject(bucketName, objectKey);
     }
     public void delete(String objectKey) {
            s3.deleteObject(bucketName, objectKey);
     }
     public void delete() {
            s3.deleteObject(bucketName, key);
     }
    private static File createSampleFile() throws IOException {
        File file = File.createTempFile("aws-java-sdk-", ".txt");
        file.deleteOnExit();

        Writer writer = new OutputStreamWriter(new FileOutputStream(file));
        writer.write("abcdefghijklmnopqrstuvwxyz\n");
        writer.write("01234567890112345678901234\n");
        writer.write("!@#$%^&*()-=[]{};':',.<>/?\n");
        writer.write("01234567890112345678901234\n");
        writer.write("abcdefghijklmnopqrstuvwxyz\n");
        writer.close();

        return file;
    }
    private static File createObjectFile(String sz) throws IOException {
        File file = File.createTempFile("aws-java-sdk-", ".txt");
        file.deleteOnExit();

        Writer writer = new OutputStreamWriter(new FileOutputStream(file));
        writer.write(sz);
        writer.close();

        return file;
    }

    private static String getTextInputStream(InputStream input) throws IOException {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = new BufferedReader(new InputStreamReader(input));
        while (true) {
            String line = reader.readLine();
            if (line == null) break;
            sb.append(line);
        }
        return(sb.toString());
    }
    private void displayTextInputStream(InputStream input) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(input));
        while (true) {
            String line = reader.readLine();
            if (line == null) break;
            dlcutil.sysOut("    " + line);
        }
    }

}
