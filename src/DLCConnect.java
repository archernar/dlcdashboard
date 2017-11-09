//import com.dlcdashboard.util.InstanceExtended;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.HashMap;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.File;
import java.util.Arrays;
import java.util.ArrayList;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.DecimalFormat;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.ec2.AmazonEC2;
import com.amazonaws.services.ec2.AmazonEC2ClientBuilder;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.identitymanagement.AmazonIdentityManagementClient;
import com.amazonaws.services.ec2.model.InstanceBlockDeviceMapping;
import com.amazonaws.services.ec2.AmazonEC2Client;
import com.amazonaws.services.sqs.AmazonSQSClient;
import com.amazonaws.regions.Regions;   // Enum
import com.amazonaws.regions.Region;    // Class with the methods
import com.amazonaws.services.cloudwatch.AmazonCloudWatchClient;
import com.amazonaws.services.cloudwatch.model.Datapoint;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsResult;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsRequest;
import com.amazonaws.services.cloudwatch.model.Dimension;
import com.amazonaws.services.sqs.model.ListQueuesResult;
import com.amazonaws.services.ec2.model.DescribeInstancesRequest;
import com.amazonaws.services.ec2.model.Reservation;
import com.amazonaws.services.elasticbeanstalk.AWSElasticBeanstalkClient;
import com.amazonaws.services.redshift.AmazonRedshiftClient;
import com.amazonaws.services.rds.AmazonRDSClient;
public class DLCConnect {
    private DLCUtil dlcutil = new DLCUtil(false);
    String env;
    String key;
    String phrase;
    HttpServletRequest req;
    String sec;
    String envreg;
    String region;
    String flag;
    String accountNumber;
    long duration;

    // http://www.javamex.com/tutorials/collections/using_4.shtml
    Map<String, String>                      envregcache  = new HashMap<String, String>(64);
    Map<String, String>                         regcache  = new HashMap<String, String>(64);
    Map<String, String>                         envcache  = new HashMap<String, String>(64);
    Map<String, BasicAWSCredentials>            credcache = new HashMap<String, BasicAWSCredentials>(32);
    Map<String, AmazonEC2Client>                ec2cache  = new HashMap<String, AmazonEC2Client>(32);
    Map<String, AmazonCloudWatchClient>         cwcache   = new HashMap<String, AmazonCloudWatchClient>(32);
    Map<String, AmazonSQSClient>                sqscache  = new HashMap<String, AmazonSQSClient>(32);
    Map<String, AWSElasticBeanstalkClient>      ebscache  = new HashMap<String, AWSElasticBeanstalkClient>(32);
    Map<String, AmazonIdentityManagementClient> iamcache  = new HashMap<String, AmazonIdentityManagementClient>(32);
    //map.put("name", "demo");
    //map.get("name");

    public DLCConnect() {
        super();
        this.flag = randomString( 8 ); 
        this.duration = 0L;
    }
    public DLCConnect(String env, String region, String key, String sec, String phrase) {
        super();
        dlcutil.assert_on(); 
        dlcutil.assertion(!phrase.equals(""),"phrase is a EMPTY STRING"); 


        Custom custom = new Custom();
        String sz = "";
        this.duration = 0L;
        this.phrase = phrase;
        this.req = req;
        this.env = env;
        this.key = key;
        this.sec = sec;
        this.accountNumber = custom.getEnvAccountNumber(env);
        this.region = region;
        this.flag = randomString( 8 ); 
        sz = custom.mapEnvNamePartsToChar(env);
        this.envreg    = sz+this.region;
    }
    public DLCConnect(int iiii, String env, String region) {
        super();
        Custom custom = new Custom();
        String sz = "";
        this.duration = 0L;
        this.env = env;
        this.key = "";
        this.sec = "";
        this.accountNumber = custom.getEnvAccountNumber(env);
        this.region = region;
        this.flag = randomString( 8 ); 
        sz = custom.mapEnvNamePartsToChar(env);
        this.envreg    = sz+this.region;
    }

public String getPhrase() { 
    return this.phrase;
}
public String getThisKeyPhrase() { 
    return this.phrase;
}
private String mapEnvReg(String env, String region) {
     Custom custom = new Custom();
     String sz = custom.mapEnvNamePartsToChar(env);
     return (sz + region);
}

public static List<InstanceX> filterInstanceXList(List<InstanceX> list, String pattern) {
     List<InstanceX> retList = new ArrayList<InstanceX>();
     if (pattern.equals(""))
          return(list);
     else {
          Pattern r = Pattern.compile(pattern);
          for (InstanceX ie:list) { 
               Matcher m = r.matcher(ie.getId());
               if (m.find()) retList.add(ie);
          }
          return(retList);
     }
}

public List<InstanceX> getListByNode(DLCConnect cn, String env, String reg, String node) {
     List <String> list = new ArrayList<String>();
     list.add(node);
     DescribeInstancesRequest req = new DescribeInstancesRequest();
     req.setInstanceIds(list);
     List <Reservation> res =  cn.ConnectEC2(env,reg).describeInstances(req).getReservations();
     return InstanceX.instanceXList(cn,env,reg,res);
}
public List<InstanceX> getInstanceStorageList(DLCConnect cn, String env, String reg) {
     return InstanceX.instanceXInstanceStorageList(cn,env,reg,cn.ConnectEC2(env,reg).describeInstances().getReservations());
}
public List<InstanceX> getList(DLCConnect cn, String env, String reg) {
     return InstanceX.instanceXList(cn,env,reg,cn.ConnectEC2(env,reg).describeInstances().getReservations());
}
public List<InstanceX> getList(DLCConnect cn, String env, String reg,String filter) {
     // List<InstanceX> l = InstanceX.instanceXList(cn,env,reg,cn.ConnectEC2(env,reg).describeInstances().getReservations());
     DLCUtil u = new DLCUtil(false);
     List <Reservation> res = cn.ConnectEC2(env,reg).describeInstances().getReservations();

     List<InstanceX> l = InstanceX.instanceXList(cn,env,reg,res);
     return filterInstanceXList(l,filter);
}
     
public double getListCost(DLCConnect cn, String env, String reg) {
     double d = 0.0;
     List<InstanceX> list = InstanceX.instanceXList(cn,env,reg,cn.ConnectEC2(env,reg).describeInstances().getReservations());
     for (InstanceX ie:list) {
               d = d + Double.parseDouble( ie.getPrice() );
     }
     return d; 
}
public AmazonRDSClient ConnectRDS(String aws_env, String aws_reg) {
     BasicAWSCredentials awsCredentials = getCreds(aws_env, getKeyPhrase());
     AmazonRDSClient rds = new AmazonRDSClient(awsCredentials);
     switch (aws_reg) {
               case "E1":
                    rds.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_EAST_1));
                    break; 
               case "W1":
                    rds.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_1));
                    break; 
               case "W2":
                    rds.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_2));
                    break; 
               default:
                    rds = null;
                    break; 
     }
     return (rds);
}
public AmazonRedshiftClient ConnectRedshift(String aws_env, String aws_reg) {
     BasicAWSCredentials awsCredentials = getCreds(aws_env, getKeyPhrase());
     AmazonRedshiftClient redshift = new AmazonRedshiftClient(awsCredentials);
     switch (aws_reg) {
               case "E1":
                    redshift.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_EAST_1));
                    break; 
               case "W1":
                    redshift.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_1));
                    break; 
               case "W2":
                    redshift.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_2));
                    break; 
               default:
                    redshift = null;
                    break; 
     }
     return (redshift);
}

public AmazonS3Client ConnectS3(String aws_env, String aws_reg) {
     BasicAWSCredentials awsCredentials = getCreds(aws_env, getKeyPhrase());
     AmazonS3Client s3 = new AmazonS3Client(awsCredentials);
     switch (aws_reg) {
               case "E1":
                    s3.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_EAST_1));
                    break; 
               case "W1":
                    s3.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_1));
                    break; 
               case "W2":
                    s3.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_2));
                    break; 
               default:
                    s3 = null;
                    break; 
     }
     return (s3);
}
public AWSElasticBeanstalkClient ConnectEBS(String aws_env, String aws_reg) {

    BasicAWSCredentials awsCredentials;
    AWSElasticBeanstalkClient ebs;

    awsCredentials =  this.credcache.get(aws_env);
    if ( awsCredentials == null ) {
         this.credcache.put( aws_env, getCreds(aws_env, getKeyPhrase()) );
         awsCredentials = this.credcache.get(aws_env);
    }
    ebs = this.ebscache.get(aws_env);
    this.envcache.put("ebs",aws_env);
    this.regcache.put("ebs",aws_reg);
    this.envregcache.put("ebs",aws_env + "-" + aws_reg);
    if ( ebs == null ) {
         this.ebscache.put(aws_env, new AWSElasticBeanstalkClient(awsCredentials));
         this.envcache.put("ebs",aws_env);
         this.regcache.put("ebs",aws_reg);
         ebs = this.ebscache.get(aws_env);
    }
    switch (aws_reg) {
               case "E1":
                    ebs.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_EAST_1));
                    break; 
               case "W1":
                    ebs.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_1));
                    break; 
               case "W2":
                    ebs.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_2));
                    break; 
               default:
                    ebs = null;
                    break; 
     }
     return (ebs);
}
public AmazonSQSClient ConnectSQS(String aws_env, String aws_reg) {
    BasicAWSCredentials awsCredentials;
    AmazonSQSClient sqs;

    awsCredentials =  this.credcache.get(aws_env);
    if ( awsCredentials == null ) {
         this.credcache.put( aws_env, getCreds(aws_env, getKeyPhrase()) );
         awsCredentials = this.credcache.get(aws_env);
    }
    sqs = this.sqscache.get(aws_env);
    this.envcache.put("sqs",aws_env);
    this.regcache.put("sqs",aws_reg);
    this.envregcache.put("sqs",aws_env + "-" + aws_reg);
    if ( sqs == null ) {
         this.sqscache.put(aws_env, new AmazonSQSClient(awsCredentials));
         this.envcache.put("sqs",aws_env);
         this.regcache.put("sqs",aws_reg);
         sqs = this.sqscache.get(aws_env);
    }
    switch (aws_reg) {
               case "E1":
                    sqs.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_EAST_1));
                    break; 
               case "W1":
                    sqs.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_1));
                    break; 
               case "W2":
                    sqs.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_2));
                    break; 
               default:
                    sqs = null;
                    break; 
     }
     return (sqs);
}
public AmazonCloudWatchClient ConnectCloudWatch(String aws_env, String aws_reg) {
    BasicAWSCredentials awsCredentials;
    AmazonCloudWatchClient cw;

    awsCredentials =  this.credcache.get(aws_env);
    if ( awsCredentials == null ) {
         this.credcache.put( aws_env, getCreds(aws_env, getKeyPhrase()) );
         awsCredentials = this.credcache.get(aws_env);
    }
    cw = this.cwcache.get(aws_env);
    this.envcache.put("cw",aws_env);
    this.regcache.put("cw",aws_reg);
    this.envregcache.put("cw",aws_env + "-" + aws_reg);
    if ( cw == null ) {
         this.cwcache.put(aws_env, new AmazonCloudWatchClient(awsCredentials));
         this.envcache.put("cw",aws_env);
         this.regcache.put("cw",aws_reg);
         cw = this.cwcache.get(aws_env);
    }
    switch (aws_reg) {
              case "E1":
                   cw.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_EAST_1));
                   break; 
              case "W1":
                   cw.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_1));
                   break; 
              case "W2":
                   cw.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_2));
                   break; 
              default:
                   cw = null;
                   break; 
    }
     return (cw);
}

public AmazonIdentityManagementClient ConnectIAM(String aws_env) {
     AmazonIdentityManagementClient iam;
     iam = new AmazonIdentityManagementClient( getCreds(aws_env, getKeyPhrase()) );
     this.envcache.put("iam",aws_env);
     return (iam);
}
public AmazonIdentityManagementClient ConnectIAM22222(String aws_env, String aws_reg) {
     BasicAWSCredentials awsCredentials;
     AmazonIdentityManagementClient iam;

     awsCredentials =  this.credcache.get(aws_env);
     if ( awsCredentials == null ) {
          this.credcache.put( aws_env, getCreds(aws_env, getKeyPhrase()) );
          awsCredentials = this.credcache.get(aws_env);
     }
     iam = this.iamcache.get(aws_env);
     this.envcache.put("iam",aws_env);
     this.regcache.put("iam",aws_reg);
     this.envregcache.put("iam",aws_env + "-" + aws_reg);
     if ( iam == null ) {
          this.iamcache.put(aws_env, new AmazonIdentityManagementClient(awsCredentials));
          this.envcache.put("iam",aws_env);
          this.regcache.put("iam",aws_reg);
          iam = this.iamcache.get(aws_env);
     } 

     switch (aws_reg) {
               case "E1":
                    iam.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_EAST_1));
                    break; 
               case "W1":
                    iam.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_1));
                    break; 
               case "W2":
                    iam.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_2));
                    break; 
               default:
                    iam = null;
                    break; 
     }
     return (iam);
}
public String getDurationAsString() {
     return(Long.toString(this.duration));
}

public long getDuration() {
     return ( this.duration );
}
public long setDuration(long duration) {
     this.duration  = duration;
     return ( this.duration);
}
public String getIAMEnvReg() {
          return mapEnvReg( this.envcache.get("iam"), this.regcache.get("iam") );
}
public String getIAMEnvMapped() {
          return(envMapper(this.envcache.get("iam")));
}
public String getIAMEnv() {
          return(this.envcache.get("iam"));
}
public String getEBSEnv() {
          return(this.envcache.get("ebs"));
}
public String getEBSEnvMapped() {
          return(envMapper(this.envcache.get("ebs")));
}
public String getEC2Env() {
          return(this.envcache.get("ec2"));
}
public String getEC2EnvMapped() {
          return(envMapper(this.envcache.get("ec2")));
}
public String getSQSEnv() {
          return(this.envcache.get("sqs"));
}
public String getIAMReg() {
          return(this.regcache.get("iam"));
}
public String getEBSReg() {
          return(this.regcache.get("ebs"));
}
public String getEC2Reg() {
          return(this.regcache.get("ec2"));
}
public String getSQSReg() {
          return(this.regcache.get("sqs"));
}
public String getIAMEnvRegOld() {
          return(this.envregcache.get("iam"));
}
public String getEC2EnvReg() {
          return(this.envregcache.get("ec2"));
}
public String getSQSEnvReg() {
          return(this.envregcache.get("sqs"));
}
public String getMappedEnv() {
     return (Custom.nameToChar(this.env));
}

private String envMapper(String sz) {
     return (Custom.nameToChar(sz));
}
public String getEnv() {
     return ( this.env );
}
public String getRegion() {
     return ( this.region );
}

public AmazonEC2Client ConnectEC2NoCache(String aws_env, String aws_reg, String phrase) {
     return ( EC2ConnectNoCache(aws_env+"XXXXXXX", aws_reg, phrase) );
}

public AmazonEC2Client EC2ConnectNoCache(String aws_env, String aws_reg, String phrase) {
    AmazonEC2Client ec2 = null;
    this.env    = aws_env;
    this.region = aws_reg;
    ec2 = new AmazonEC2Client(getBadCreds(aws_env, phrase ));
    this.EC2SetRegionNoCache(ec2, aws_reg);
    dlcutil.assert_on(); 
    dlcutil.assertion(ec2 != null,"NULL OBJECT"); 
    dlcutil.assertion(ec2 == null,"NON NULL OBJECT"); 
    dlcutil.sysOut(ec2.toString());
    return (ec2);
}
public AmazonEC2Client EC2SetRegionNoCache(AmazonEC2Client ec2, String aws_reg) {
    switch (aws_reg) {
               case "E1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_EAST_1));
                    break; 
               case "W1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_1));
                    break; 
               case "W2":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_2));
                    break; 
               case "A1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.AP_NORTHEAST_1));
                    break; 
               case "A2":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.AP_SOUTHEAST_1));
                    break; 
               case "A3":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.AP_SOUTHEAST_2));
                    break; 
               case "C1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.CN_NORTH_1));
                    break; 
               case "U1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.EU_CENTRAL_1));
                    break; 
               case "U2":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.EU_WEST_1));
                    break; 
               case "S1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.SA_EAST_1));
                    break; 
               default:
                    ec2 = null;
                    break; 
     }
     return (ec2);
}
public AmazonEC2Client ConnectEC2(String aws_env, String aws_reg) {
     return ( Connect(aws_env, aws_reg) );
}
// Create the AmazonEC2Client object so we can call various APIs.
//
//         AmazonEC2 ec2 = AmazonEC2ClientBuilder.standard()
//                     .withCredentials(new AWSStaticCredentialsProvider(credentials))
//                                 .withRegion("us-west-2")
//                                             .build();
public AmazonEC2Client Connect(String aws_env, String aws_reg) {
    BasicAWSCredentials awsCredentials;
    AmazonEC2Client ec2;
    dlcutil.sysOut("CACHE CONNECT:", aws_env, aws_reg);
    dlcutil.sysOut("credcache:",this.credcache.toString());
    this.env    = aws_env;
    this.region = aws_reg;
if ( 1 == 1) {
    awsCredentials =  this.credcache.get(aws_env);
    if ( awsCredentials == null ) {
         this.credcache.put( aws_env, getCreds(aws_env, getThisKeyPhrase()) );
         awsCredentials = this.credcache.get(aws_env);
         dlcutil.sysOut("NEW: Credential");
    } else {
         dlcutil.sysOut("CACHED: Credential");
    }
    
    ec2 = this.ec2cache.get(aws_env);
    this.envcache.put("ec2",aws_env);
    this.regcache.put("ec2",aws_reg);
    this.envregcache.put("ec2",aws_env + "-" + aws_reg);
    if ( ec2 == null ) {
         this.ec2cache.put(aws_env, new AmazonEC2Client(awsCredentials));
         this.envcache.put("ec2",aws_env);
         this.regcache.put("ec2",aws_reg);
         ec2 = this.ec2cache.get(aws_env);
         dlcutil.sysOut("NEW: Connection");
    } else {
         dlcutil.sysOut("CACHED: Connection");
    }
} else {
       ec2 = new AmazonEC2Client(getCreds(aws_env, getThisKeyPhrase()));
}
     switch (aws_reg) {
               case "E1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_EAST_1));
                    break; 
               case "W1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_1));
                    break; 
               case "W2":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.US_WEST_2));
                    break; 
               case "A1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.AP_NORTHEAST_1));
                    break; 
               case "A2":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.AP_SOUTHEAST_1));
                    break; 
               case "A3":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.AP_SOUTHEAST_2));
                    break; 
               case "C1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.CN_NORTH_1));
                    break; 
               case "U1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.EU_CENTRAL_1));
                    break; 
               case "U2":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.EU_WEST_1));
                    break; 
               case "S1":
                    ec2.setRegion(com.amazonaws.regions.Region.getRegion(Regions.SA_EAST_1));
                    break; 
               default:
                    ec2 = null;
                    break; 
     }
     return (ec2);
}

private BasicAWSCredentials getBadCreds(String aws_env, String keyphrase) {
     aws_env = "BAD ENV";
     keyphrase = "BADBADBADBADBADBADBABDBADKEYPHRASE";
     Custom custom = new Custom();
     return(custom.getCreds(aws_env, keyphrase));

}
private BasicAWSCredentials getCreds(String aws_env, String keyphrase) {
     // GETCREDS
     Custom custom = new Custom();
     return(custom.getCreds(aws_env, keyphrase));

}
static String getKeyPhrase() { 
    String old = "imnfFITMKfitldTBTO";
    return "ekfKr5I73K5KLFRYwH";
}
static String randomString( int len )  
{ 
   String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
   Random rnd = new Random(); 
   StringBuilder sb = new StringBuilder( len ); 
   for( int i = 0; i < len; i++ )  
      sb.append( AB.charAt( rnd.nextInt(AB.length()) ) ); 
   return sb.toString(); 
}


}
