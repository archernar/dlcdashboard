import java.util.Calendar;
import java.util.TimeZone;
import java.util.Collections;
import java.util.Comparator;
import java.util.Random;
import java.util.List;
import java.util.Map.Entry;
import java.util.Map;
import java.util.Date;
import org.joda.time.*;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import java.text.SimpleDateFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;
import javax.servlet.ServletException;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.DecimalFormat;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.identitymanagement.AmazonIdentityManagementClient;
import com.amazonaws.services.identitymanagement.model.User;
import com.amazonaws.services.identitymanagement.model.ListUsersRequest;
import com.amazonaws.services.identitymanagement.model.GetUserRequest;
import com.amazonaws.services.identitymanagement.model.GetUserResult;
import com.amazonaws.services.identitymanagement.model.Group;
import com.amazonaws.services.identitymanagement.model.Role;
import com.amazonaws.services.identitymanagement.model.ListUsersResult;
import com.amazonaws.services.identitymanagement.model.ListGroupsResult;
import com.amazonaws.services.identitymanagement.model.GetGroupRequest;
import com.amazonaws.services.identitymanagement.model.ListRolesResult;
import com.amazonaws.services.identitymanagement.model.ListGroupsForUserRequest;
import com.amazonaws.services.identitymanagement.model.ListGroupsForUserResult;
import com.amazonaws.services.ec2.model.InstanceBlockDeviceMapping;
import com.amazonaws.services.ec2.model.EbsInstanceBlockDevice;
import com.amazonaws.services.ec2.model.SecurityGroup;
import com.amazonaws.services.ec2.model.IpPermission;
import com.amazonaws.services.ec2.model.DescribeVolumesResult;
import com.amazonaws.services.ec2.model.DescribeVolumesRequest;
import com.amazonaws.services.ec2.model.Volume;
import com.amazonaws.services.ec2.model.DescribeImagesRequest;
import com.amazonaws.services.ec2.model.DescribeImagesResult;
import com.amazonaws.services.ec2.model.Image;
import com.amazonaws.services.ec2.model.DescribeInstancesRequest;
import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.Reservation;
import com.amazonaws.services.ec2.model.Tag;
import com.amazonaws.services.ec2.model.GroupIdentifier;
import com.amazonaws.services.ec2.AmazonEC2Client;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClient;
import com.amazonaws.services.sqs.model.CreateQueueRequest;
import com.amazonaws.services.sqs.model.DeleteMessageRequest;
import com.amazonaws.services.sqs.model.DeleteQueueRequest;
import com.amazonaws.services.sqs.model.Message;
import com.amazonaws.services.sqs.model.ReceiveMessageRequest;
import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.amazonaws.services.sqs.model.GetQueueAttributesResult;

import com.amazonaws.regions.Regions;   // Enum
import com.amazonaws.regions.Region;    // Class with the methods
import com.amazonaws.services.cloudwatch.AmazonCloudWatchClient;
import com.amazonaws.services.cloudwatch.model.Datapoint;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsResult;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsRequest;
import com.amazonaws.services.cloudwatch.model.Dimension;
import com.amazonaws.services.sqs.model.ListQueuesResult;
import com.amazonaws.services.ec2.model.VolumeAttachment;
import com.amazonaws.services.elasticbeanstalk.AWSElasticBeanstalkClient;
import com.amazonaws.services.elasticbeanstalk.model.DescribeApplicationsResult;
import com.amazonaws.services.elasticbeanstalk.model.ApplicationDescription;
import com.amazonaws.services.redshift.AmazonRedshiftClient;
import com.amazonaws.services.redshift.model.DescribeClustersResult;
import com.amazonaws.services.redshift.model.Cluster;
import com.amazonaws.services.redshift.model.ClusterNode;
import com.amazonaws.services.rds.AmazonRDSClient;
import com.amazonaws.services.rds.model.DescribeDBInstancesResult;
import com.amazonaws.services.rds.model.DBInstance;

// https://github.com/fangyidong/json-simple
// import com.fasterxml.jackson.core.JsonParseException;
// import com.fasterxml.jackson.databind.JsonMappingException;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.fasterxml.jackson.annotation.JsonProperty;
//                              sgvco(dq(
//                                anchor + "&nbsp;&nbsp;" +
//                                getAnchor(ie.getCpuMetricUrl(),"C") + "&nbsp;"+
//                                getAnchor(ie.getNetinMetricUrl(),"I") + "&nbsp;"+
//                                getAnchor(ie.getNetoutMetricUrl(),"O")     )) +c+
// http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/publishingMetrics.html#publishingDataPoints1
// out.println(y0);
// out.println(cryDecode(y0));


public class s3u extends HttpServlet {

    private final DLCUtil UTIL = new DLCUtil(true);
    private static final DLCConst CONST = new DLCConst();

    //private static final List<String> ACTIVE_REGIONS = Arrays.asList("E1","W1","W2","A1","U1","U2");
    private static final List<String> ACTIVE_REGIONS = Arrays.asList("E1","E2","W1","W2");

    int entry = 0;
    long startTime = 0;
    long endTime = 0;

    public s3u() {
        super();
        java.security.Security.setProperty("networkaddress.cache.ttl" , "60");
        Custom custom = new Custom();
        Cache.instanceConfigMapInit();
        Cache.instancePriceMapInit();
    }
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
         HttpSession session = req.getSession(true);
         String phrase      = UTIL.getURLStringParameter(req, "phrase", "");
         if ( phrase.equals("") )
              phrase = (String) session.getAttribute("phrase"); 
         else {
                   session.setAttribute("phrase", phrase); 
              }

         String stringData = UTIL.getStringParameter(req, "crack");
         String op         = UTIL.getStringParameter(req, "op");
         String sz = "";
         switch (op.toLowerCase()) {
              case "figgy":
                    try                 { S3 s3 = new S3(stringData); sz=s3.get(); } 
                    catch (Exception e) { UTIL.basicExceptionHandling(e); }
                    MyPrintWriter out = new MyPrintWriter(resp);
                    out.println(sz);
                    break; 
         }
    }

    protected void doGet(final HttpServletRequest req, final HttpServletResponse resp) throws ServletException, IOException {
    UTIL.sysOut(req.getRequestURL().toString() + "?" + req.getQueryString());
    
    // PrintWriter out = resp.getWriter();
    MyPrintWriter out = new MyPrintWriter(resp);
    BuildNumber buildnumber = new BuildNumber();
    Custom custom = new Custom();
    //DLCTools tool = new DLCTools(true);
    //tool.sysOut("doGet");
    //tool.assert_on().assertion(false,"MESSAGE");

    DLCConnect cn = null;
    String szPricingString;
    int moder = 0;
    InstanceX.setVolumeDataFlag(0);
    entry++;


    String namespace   = "";
    String sz   = "";
    String szContentType   = "";
    HttpSession session = req.getSession(true);
    String phrase      = UTIL.getURLStringParameter(req, "phrase", "");

    if ( phrase.equals("") )
         phrase = (String) session.getAttribute("phrase"); 
    else {
              session.setAttribute("phrase", phrase); 
              // TestConnect  tc  = new TestConnect("DTCCQA",phrase);
         }
    session.setAttribute("phrase", "MOOJOO"); 
    phrase = (String) session.getAttribute("phrase"); 

    String aws_key     = UTIL.getURLStringParameter(req, "key", "");
    String aws_sec     = UTIL.getURLStringParameter(req, "sec", "");
    String aws_env     = UTIL.getURLStringParameter(req, "env", custom.getDefaultAccount());
    String op          = UTIL.getURLStringParameter(req, "op", "inventory");
    String spec        = UTIL.getURLStringParameter(req, "spec", "");
    int msgsz          = UTIL.sz2int(UTIL.getURLStringParameter(req, "msgsz",  "16"));
    int msgct          = UTIL.sz2int(UTIL.getURLStringParameter(req, "msgct",  "1024"));
    int msgmt          = UTIL.sz2int(UTIL.getURLStringParameter(req, "msgmt",  "1"));
    int refresh        = UTIL.sz2int(UTIL.getURLStringParameter(req, "refresh","1000"));
    if (op.equals("queue") || op.equals("queuetestadd") || op.equals("queuetestdelete"))
         if (!spec.equals("")) {
               String[] parts = spec.split("/");
               String szSpecAcct = parts[parts.length-2];
               if ( UTIL.regex(szSpecAcct,"[0-9]*") )
                    aws_env = custom.getAccountEnvString(szSpecAcct);
         }

    String aws_reg     = UTIL.getURLStringParameter(req, "loc", custom.getDefaultRegion());
    String aws_region  = UTIL.getURLStringParameter(req, "loc", custom.getDefaultRegion());
    
    List<String> speclist = Arrays.asList(spec);
    String filter      = UTIL.getURLStringParameter(req, "filter", "");
    String node        = UTIL.getURLStringParameter(req, "node", "none");
    String qual        = UTIL.getURLStringParameter(req, "qual", "default");
    String mappedqual  = mapQ(qual);
    String vnode       = UTIL.getURLStringParameter(req, "vnode", "none");
    String v1_param    = UTIL.getURLStringParameter(req, "v1", "none");
    String v2_param    = UTIL.getURLStringParameter(req, "v2", "none");
    int paramHours     = UTIL.getURLIntParameter(req, "hours",  "6");
    int offset         = UTIL.getURLIntParameter(req, "offset", "0");
    int period         = UTIL.getURLIntParameter(req, "period", "60");
    int hours          = paramHours;
    String serviceUrl  = UTIL.getServiceUrl(aws_env,op,qual,node,aws_reg,period,paramHours);

    if ( session.isNew() ) {
         cn = new DLCConnect(aws_env, aws_region, aws_key, aws_sec, phrase); 
         session.setAttribute("DLCConnect", cn); 
    } else {
         cn = (DLCConnect) session.getAttribute("DLCConnect"); 
    }
    String accountNumber   = custom.getAccountNumber(aws_env);
    List<String> TESTACCOUNTS  = custom.getTestAccounts();
    List<String> ACCOUNTS  = custom.getAccounts();
    List<String> TAGGED_ACCOUNTS  = custom.getTaggedAccounts();
    List<String> SUB_ACCOUNTS  = custom.getSubAccounts();
    List<String> REGIONS   = custom.getRegions();

    List<String> VERSION = new ArrayList<String>();
    VERSION.add(buildnumber.getBuildNumber());

    List<String> SELECTED_REGIONS = new ArrayList<String>();
    if (aws_region.equals("ALL"))
         for (String i:ACTIVE_REGIONS) SELECTED_REGIONS.add(i); 
    else
         SELECTED_REGIONS.add(aws_region);

    List<String> SELECTED_ENVS = new ArrayList<String>();
    if (aws_env.equals("ALL"))
         for (String i:ACCOUNTS) SELECTED_ENVS.add(i); 
    else
         SELECTED_ENVS.add(aws_env);


    //  resp.setContentType("application/json");

    szContentType   = "application/json";
    if (op.equals("csv")){
         resp.setContentType(szContentType);
         //szContentType = "text/csv";
         //resp.setContentType(szContentType);
         //resp.setHeader("Content-Disposition", "attachment; filename=dlcdashboard.csv");
    }
    else {
         resp.setContentType(szContentType);
    }

     int n=0;
     String c = ",";
     String delim = "";
     try {
          MyStringBuilder sbHeader = new MyStringBuilder();
          MyStringBuilder sbOut = new MyStringBuilder();
          MyTimeStamp ts = new MyTimeStamp();

          sbHeader.JSON_NameValue( "uid"           , "arn-12345a",
                                   "v1_param"      ,  v1_param,
                                   "v2_param"      ,  v2_param,
                                   "updateDate"    , ts.nowzulu(),
                                   "titleText"     , "First Application",
                                   "mainText"      , "Hello World",
                                   "redirectionUrl", "http://www.google.com",
                                   "timestamp"  , ts.getTimeStamp(),
                                   "timestamp"  , ts.now(),
                                   "account"    , accountNumber,
                                   "aws_env"    , aws_env,
                                   "region"     , aws_reg,
                                   "regionname" , UTIL.mapRegionCodesToNames(aws_reg),
                                   "node"       , node,
                                   "actualnow"  , new DateTime().minusHours(0).toDate().toString(),
                                   "hours"      , new Integer(hours).toString(),
                                   "offset"     , new Integer(offset).toString(),
                                   "effoff"     , new Integer(offset+hours).toString()
                                  );
// Symbol  Meaning                      Presentation  Examples
// ------  -------                      ------------  -------
// G       era                          text          AD
// C       century of era (>=0)         number        20
// Y       year of era (>=0)            year          1996
//
// x       weekyear                     year          1996
// w       week of weekyear             number        27
// e       day of week                  number        2
// E       day of week                  text          Tuesday; Tue
//
// y       year                         year          1996
// D       day of year                  number        189
// M       month of year                month         July; Jul; 07
// d       day of month                 number        10
//
// a       halfday of day               text          PM
// K       hour of halfday (0~11)       number        0
// h       clockhour of halfday (1~12)  number        12
//
// H       hour of day (0~23)           number        0
// k       clockhour of day (1~24)      number        24
// m       minute of hour               number        30
// s       second of minute             number        55
// S       fraction of second           number        978
//
// z       time zone                    text          Pacific Standard Time; PST
// Z       time zone offset/id          zone          -0800; -08:00; America/Los_Angeles
//
// '       escape for text              delimiter
// ''      single quote                 literal       '
 
          DateTimeFormatter fmt         = DateTimeFormat.forPattern("MM/dd kk:mm");
          String            szDate      = "";


          //sbHeader.appendln(dqcolon("effnow")  + dqcomma(new DateTime().minusHours(offset).toDate().toString()));
          szDate      = fmt.print( new DateTime().minusHours(offset));
          sbHeader.appendln(dqcolon("effnow")  + dqcomma(szDate));

          //sbHeader.appendln(dqcolon("effpst")  + dqcomma(new DateTime().minusHours(offset+hours).toDate().toString()));
          szDate      = fmt.print( new DateTime().minusHours(offset+hours));
          sbHeader.appendln(dqcolon("effpst")  + dqcomma(szDate));

          sbHeader.appendln(dqcolon("qual")    + dqcomma(qual));
          sbHeader.appendln(dqcolon("qf")      + dqcomma(mapQF(qual)));
          sbHeader.jsonNVc("mappedqual",  mappedqual);
          sbHeader.jsonNVc("op",          op);
          sbHeader.jsonNVc("entry",       entry);
          sbHeader.jsonNVc("url",         serviceUrl);
          switch (op.toLowerCase()) {
               case "images":
                    out.println(CONST.szJSON_COLS);
                    tableHeadersDefs(out, Arrays.asList("Instance","imageID","imagename","imagedescription"));
                    break; 
          }
          
          switch (op.toLowerCase()) {

               case "phrase":
                    resp.sendRedirect("monitor.html");
                    break; 

               case "nameduser":
                    n=0;
                    for (String i:SELECTED_ENVS) {
                         AmazonIdentityManagementClient conn  = cn.ConnectIAM(i);
                         List <User> l = new ArrayList<User>();
                         GetUserRequest r = new GetUserRequest();
                         r.setUserName("cloudwatch");
                         l.add(conn.getUser(r).getUser());
                         // NEED HERE n=usus(conn,n,i,aws_reg,out,l);
                    }
                    out.println("]");
                    break; 
               case "images":
                    n=0;
                    for (String i:SELECTED_ENVS) {
                         AmazonEC2Client conn = cn.Connect(i,aws_reg);
                         n=imim(conn,n,i,aws_reg,out, conn.describeInstances().getReservations());
                    }
                    out.println("]");
                    break; 
               case "start":
                    if (moder == 0) {
                         InstanceX ie = new InstanceX(cn, aws_env, aws_reg, node);
                         ie.startInstance();
                         moder=1;
                    }
               case "stop":
                    if (moder == 0) {
                         InstanceX ie = new InstanceX(cn, aws_env, aws_reg, node);
                         ie.stopInstance();
                         moder=1;
                    }
               case "allenvs":
               case "activeenvs":
               case "selectedenvs":
               case "version":
               case "bucketcount":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(valueOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         if (op.toLowerCase().equals("activeenvs"))   n=valueOpRows(n,sbOut,ACCOUNTS);
                         if (op.toLowerCase().equals("selectedenvs")) n=valueOpRows(n,sbOut,SELECTED_ENVS);
                         if (op.toLowerCase().equals("version"))      n=valueOpRows(n,sbOut,VERSION);
                         if (op.toLowerCase().equals("bucketcount")) {
                                   AmazonS3Client conn  = cn.ConnectS3(aws_env,aws_reg);
                                   n=S3BucketCountOpRows(conn,n,aws_env,sbOut,conn.listBuckets());
                         }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "instancecountall":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(instanceCountOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                    for (String i:ACCOUNTS)
                         n=instanceCountOpRows(n,i,aws_reg,sbOut,cn.Connect(i,aws_reg).describeInstances().getReservations());
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "instancecount":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(instanceCountOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                    n=instanceCountOpRows(n,aws_env,aws_reg,sbOut,cn.Connect(aws_env,aws_reg).describeInstances().getReservations());
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "subaccounts":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(valueOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         n=valueOpRows(n,sbOut,SUB_ACCOUNTS);
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "accounts":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(valueOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         n=valueOpRows(n,sbOut,TAGGED_ACCOUNTS);
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
// out.println(",{" + dqcolon("timing")  + dq( myts.markTimeBuffer() ) +"}");
// String file = "/tmp/accounts.txt";
// PrintWriter fout = new PrintWriter( new BufferedWriter(new FileWriter(file)));
// fout.println(sbOut.toString());
// fout.close();
                    break; 
               case "performancenode":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(performanceOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) {
                              n=performanceOpRows(n,cn,sbOut,cn.getListByNode(cn,i,aws_reg,node));
                         }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                         sbOut.insertln(2,dq("rowcount") + ": " + dq(n) + ",");
                         sbOut.insertln(2,dq("columncount") + ": " + dq(performanceOpCols().size()) + ",");
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "performance":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(performanceOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                              for (String i:SELECTED_ENVS) n=performanceOpRows(n,cn,sbOut,cn.getList(cn,i,aws_reg,filter));
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                         sbOut.insertln(2,dq("rowcount") + ": " + dq(n) + ",");
                         sbOut.insertln(2,dq("columncount") + ": " + dq(performanceOpCols().size()) + ",");
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "testdata":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(testdataOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) n=n+testdataOpRows(n,cn,sbOut);
                    sbOut.println(CONST.szJSON_ROWS_CLOSE_COMMA);
                    sbOut.println(dqcolon("rows_count")  + dq(n));
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "fakeinventory":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(fakeOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) n=n+fakeOpRows(n,cn,sbOut);
                    sbOut.println(CONST.szJSON_ROWS_CLOSE_COMMA);
                    sbOut.println(dqcolon("rows_count")  + dq(n));
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "s3buckets":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(S3BucketsOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   AmazonS3Client conn  = cn.ConnectS3(i,r);
                                   n=S3BucketsOpRows(conn,n,i,sbOut,conn.listBuckets());
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 
               case "tag":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(tagOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   n=tagOpRows(n,cn,sbOut,cn.getList(cn,i,r,filter));
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 
               case "beans":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(beansOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   n=beansOpRows(n,cn,i,r,sbOut);
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 
               case "cost":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(costOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   n=costOpRows(n,cn,sbOut,cn.getList(cn,i,r,filter));
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 

               case "rds":
                    n=0;
                    // (new DLCTools(true)).syscat("OK");
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(inventoryRDSOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   AmazonRDSClient conn = cn.ConnectRDS(i,r);
                                   DescribeDBInstancesResult res = conn.describeDBInstances();
                                   List<DBInstance> list = res.getDBInstances();
                                   n=inventoryRDSOpRows(n,cn,sbOut,list);
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 
               case "red":
               case "inventoryRedshift":
                    n=0;
                    // (new DLCTools(true)).syscat("OK");
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(inventoryRedshiftOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   AmazonRedshiftClient conn = cn.ConnectRedshift(i,r);
                                   DescribeClustersResult res = conn.describeClusters();
                                   List<Cluster> list = res.getClusters();
                                   n=inventoryRedshiftOpRows(n,cn,sbOut,list);
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 
               case "csv":
                    if ( ((String) session.getAttribute("csv")).length() > 0 ) 
                         sbOut.println( (String) session.getAttribute("csv")).output(out);
                    else
                         sbOut.println( "No CSV data found" ).output(out);
                    break; 
               case "inventory":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(inventoryOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   Cache.securitygroupMapInit(cn,i,r);
                                   Cache.VolumeMapInit(cn,i,r);
                                   Cache.InstanceBDMOptionMapInit(cn,i,r);
                                   Cache.InstanceIPOptionMapInit(cn,i,r);
                                   Cache.InstanceOwnerOptionMapInit(cn,i,r);
                                   n=inventoryOpRows(req,n,cn,sbOut,cn.getList(cn,i,r,filter));
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    // UTIL.chartToCSV(sbOut.toString());
                    break; 
               case "inventoryraw":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(inventoryrawOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   Cache.securitygroupMapInit(cn,i,r);
                                   Cache.VolumeMapInit(cn,i,r);
                                   Cache.InstanceBDMOptionMapInit(cn,i,r);
                                   Cache.InstanceIPOptionMapInit(cn,i,r);
                                   n=inventoryrawOpRows(req,n,cn,sbOut,cn.getList(cn,i,r,filter));
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 
               case "inventoryminus":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(inventoryminusOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   Cache.securitygroupMapInit(cn,i,r);
                                   Cache.VolumeMapInit(cn,i,r);
                                   Cache.InstanceBDMOptionMapInit(cn,i,r);
                                   Cache.InstanceIPOptionMapInit(cn,i,r);
                                   n=inventoryminusOpRows(n,cn,sbOut,cn.getList(cn,i,r,filter));
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 
               case "inventoryplus":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(inventoryplusOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   Cache.securitygroupMapInit(cn,i,r);
                                   Cache.VolumeMapInit(cn,i,r);
                                   Cache.InstanceBDMOptionMapInit(cn,i,r);
                                   Cache.InstanceIPOptionMapInit(cn,i,r);
                                   n=inventoryplusOpRows(n,cn,sbOut,cn.getList(cn,i,r,filter));
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 
               case "diskstorage":
               case "diskstoragecount":
               case "storagecount":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(diskstorageOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) {
                                   AmazonEC2Client conn = cn.Connect(i,r);
                                   n=diskstorageOpRows(n,sbOut,cn,conn.describeVolumes().getVolumes());
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "volumes":
                    InstanceX.setVolumeDataFlag(1);
                    //     for (String r:SELECTED_REGIONS) { AmazonEC2Client conn = cn.Connect(i,r);
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(volumesOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) {
                                   AmazonEC2Client conn = cn.Connect(i,r);
                                   n=volumesOpRows(req,n,sbOut,cn,conn.describeVolumes().getVolumes());
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    // UTIL.chartToCSV(sbOut.toString());
                    // UTIL.chartToCSV(sbOut.toString());
                    InstanceX.setVolumeDataFlag(0);
                    break; 
               case "queuetestadd":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(queueTestAddOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);

                         for (String i:SELECTED_ENVS) {
                                   //AmazonSQSClient conn  =   cn.ConnectSQS(i,cn.getRegion());
                                   //SQSPut  t = new SQSPut(conn,spec);
                                   //t.start();
                                   // n=queueTestAddOpRows(n,cn,sbOut,conn.listQueues().getQueueUrls(),spec,0);
                                   String phr = (String) session.getAttribute("phrase"); 
                                   for (int j=0;j<msgmt;j++) {
                                        DLCConnect dlccn = new DLCConnect(aws_env, aws_region, aws_key, aws_sec, phr); 
                                        SQSPut  t = new SQSPut(dlccn,spec,msgsz,msgct);
                                        t.start();
                                   }
                         }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "queuetestdelete":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(queueTestDeleteOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) {
                              AmazonSQSClient conn  =   cn.ConnectSQS(i,cn.getRegion());
                              n=queueTestDeleteOpRows(n,cn,sbOut,conn.listQueues().getQueueUrls(),spec);
                         }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "queue":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, dTC(queueOpCols()), CONST.JSONCC, CONST.JSONRO);
                         for (String i:SELECTED_ENVS) {
                              AmazonSQSClient conn  =   cn.ConnectSQS(i,cn.getRegion());
                              if (spec.equals(""))
                                   n=queueOpRows(n,cn,sbOut,conn.listQueues().getQueueUrls());
                              else
                                   n=queueOpRows(n,cn,sbOut,speclist);
                         }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE).output(out);
                    break; 
               case "groups":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(groupsOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) {
                              AmazonIdentityManagementClient conn  = cn.ConnectIAM(i);
                              n=groupsOpRows(n,cn,sbOut,conn.listGroups().getGroups());
                         }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "roles":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(rolesOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) {
                              AmazonIdentityManagementClient conn  = cn.ConnectIAM(cn.getEnv());
                              n=rolesOpRows(n,cn,sbOut,conn.listRoles().getRoles());
                         }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "tags":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(tagsOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) 
                                   n=tagsOpRows(n,cn,sbOut,cn.getList(cn,i,r,filter));
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "instancestorage":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(instanceStorageOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                       for (String i:SELECTED_ENVS) n=instanceStorageOpRows(n,cn,sbOut,cn.getInstanceStorageList(cn,i,aws_reg));
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "sg":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(sgOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) 
                              for (String r:SELECTED_REGIONS) { 
                                   Cache.securitygroupMapInit(cn,i,r);
                                   n=sgOpRows(n,cn,sbOut,cn.Connect(i,r).describeSecurityGroups().getSecurityGroups());
                              }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "users":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(usersOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         for (String i:SELECTED_ENVS) {
                                   //AmazonIdentityManagementClient conn  = cn.ConnectIAM(i);
                                   //n=usersOpRows(n,cn,aws_reg,sbOut,conn.listUsers().getUsers());
                                   AmazonIdentityManagementClient conn  = cn.ConnectIAM(i);
                                   n=usersOpRows(n,cn,"NAN",sbOut,conn.listUsers().getUsers());
                         }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "onetime":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         singletimeserieslastdpOpRows(mapQF(qual),sbOut,getCloudWatchData(cn,namespace,mapQ(qual),offset,hours,period,node,aws_env,aws_reg) );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "lsts":
                    namespace = "System/Linux";
               case "sts":
               case "singletimeseries":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());

sbOut.println(dq("monk") + ": [");
singletimeseriesOpRows2(mapQF(qual),sbOut,getCloudWatchData(cn,namespace,mapQ(qual),offset,hours,period,node,aws_env,aws_reg) );
sbOut.println("],");


                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);

//private static void singletimeserieslastdpOpRows(int factor, MyStringBuilder sb, List<Datapoint> list)  {
                         singletimeseriesOpRows(mapQF(qual),sbOut,getCloudWatchData(cn,namespace,mapQ(qual),offset,hours,period,node,aws_env,aws_reg) );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
if ( 1  == 0 ) {
sbOut.println(CONST.szCOMMA);
sbOut.println(CONST.szJSON_DATA_OPEN);
singletimeseriesOpRowsSecondForm(mapQF(qual),sbOut,getCloudWatchData(cn,namespace,mapQ(qual),offset,hours,period,node,aws_env,aws_reg) );
sbOut.println(CONST.szJSON_DATA_CLOSE);
}
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "fakedata":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         singletimeseriesFakeDataOpRows(mapQF(qual),sbOut );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "trendall":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(lastCostOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                    for (String i:SELECTED_ENVS) 
                         for (String r:SELECTED_REGIONS)  
                              n=lastCostOpRows(n,i,1,sbOut,getCloudWatchBillingData2(cn,i,r,"") );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "trend":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(lastCostOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                    for (String i:SELECTED_ENVS) 
                         for (String r:SELECTED_REGIONS)  
                              n=lastCostOpRows(n,i,1,sbOut,getCloudWatchBillingData2(cn,i,r,"AmazonEC2") );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "monthlycost":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(monthlyCostOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                    for (String i:SELECTED_ENVS) {
                         n=monthlyCostOpRows(n,i,1,sbOut,getCloudWatchBillingData(cn,i,aws_reg,"") );
                         n=monthlyCostOpRows(n,i,1,sbOut,getCloudWatchBillingData(cn,i,aws_reg,"AmazonEC2") );
                    }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toString());
                    break; 
               case "zook":
                    n=0;
                    String ddddd = "";
                    sbOut.print("[");
                    sbOut.print("[\"account\",\"charges\"],");
                    for (String i:ACCOUNTS){
                         sbOut.println(ddddd);
                         zookOpRows(i,1,sbOut,getCloudWatchBillingData(cn,i,aws_reg,"") );
                         ddddd=",";
                    }
                    sbOut.println("]");
                    out.println(sbOut.toStringClean());
                    break; 
               case "options":
                    try { 
                             S3 s3 = new S3(); 
                             out.println(s3.get());
                        } 
                    catch (Exception e) { UTIL.basicExceptionHandling(e); }
                    break; 
               case "zeek":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         //sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                         sbOut.println(dataTableColumns(zeekOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                    String dddd = "";
                    for (String i:ACCOUNTS){
                         sbOut.println(dddd);
                         zeekOpRows(i,1,sbOut,getCloudWatchBillingData(cn,i,aws_reg,"") );
                         dddd=",";
                    }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "amazonall":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         singletimeserieslastdpOpRows(1,sbOut,getCloudWatchBillingData(cn,aws_env,aws_reg,"") );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "amazonvpc":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         singletimeserieslastdpOpRows(1,sbOut,getCloudWatchBillingData(cn,aws_env,aws_reg,"AmazonVPC") );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "amazondirectconnect":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         singletimeserieslastdpOpRows(1,sbOut,getCloudWatchBillingData(cn,aws_env,aws_reg,"AWSDirectConnect") );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "amazondatatransfer":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         singletimeserieslastdpOpRows(1,sbOut,getCloudWatchBillingData(cn,aws_env,aws_reg,"AWSDataTransfer") );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 

               case "amazonec2":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         singletimeserieslastdpOpRows(1,sbOut,getCloudWatchBillingData(cn,aws_env,aws_reg,"AmazonEC2") );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "amazons3":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         singletimeserieslastdpOpRows(1,sbOut,getCloudWatchBillingData(cn,aws_env,aws_reg,"AmazonS3") );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "billsummary":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                    for (String i:ACCOUNTS){
                         String dd = "";
                         sbOut.println(dd);
                         singledpOpRows(1,sbOut,getCloudWatchBillingData(cn,i,aws_reg,""),i );
                         dd=",";
                    }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "redshift":
                    n=0;
                    sbOut.println(CONST.JSONOO, sbHeader.toString(), CONST.JSONCO, 
                                  dTC(OpCols("servicename","fee00")),CONST.JSONCC,CONST.JSONRO);
                    {
                         AmazonCloudWatchClient cw_conn = cn.ConnectCloudWatch(aws_env, aws_reg);
                         String dpName = "AmazonRedshift";
                         String account = (new Custom()).getAccountNumber(aws_env);
                         singledpOpRows(1,sbOut, new CW(cw_conn,account,dpName).getList(),dpName);
                    }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "bill":
                    n=0;
                    // sbOut.println(CONST.JSONOO, sbHeader.toString(),CONST.JSONCO,dTC(singletimeseriesOpCols("fee")),CONST.JSONCC,CONST.JSONRO);
                    sbOut.println(CONST.JSONOO, sbHeader.toString(),CONST.JSONCO,dTC(OpCols("servicename","fee00")),CONST.JSONCC,CONST.JSONRO);
                    AmazonCloudWatchClient cw_conn = cn.ConnectCloudWatch(aws_env, aws_reg);
                    String account = (new Custom()).getAccountNumber(aws_env);
                    {
                    singledpOpRows(1,sbOut, new CW(cw_conn,account,"").getList(),aws_env);
                    for (String dpName:custom.getServiceNames()){
                         sbOut.println(",");
                         singledpOpRows(1,sbOut, new CW(cw_conn,account,dpName).getList(),dpName);
                    }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE, CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    }
                    break; 
               case "zill":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                    singledpOpRows(1,sbOut,getCloudWatchBillingData(cn,aws_env,aws_reg,""), aws_env );
                    for (String i:custom.getServiceNames()){
                         String dd = ",";
                         sbOut.println(dd);
                         singledpOpRows(1,sbOut,getCloudWatchBillingData(cn,aws_env,aws_reg,i),i );
                         dd=",";
                    }
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "billing":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(singletimeseriesOpCols("fee")));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         singletimeseriesOpRows(1,sbOut,getCloudWatchBillingData(cn,aws_env,aws_reg,"") );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "cpu1":
                   hours=1; qual="cpu";
               case "cpu6":
                   hours=1; qual="cpu";
               case "cpu12":
                   hours=1; qual="cpu";
               case "cpu24":
                   hours=24; qual="cpu";
               case "lmts":
                    namespace = "System/Linux";
               case "mts":
               case "multipletimeseries":
                    n=0;
                    sbOut.println(CONST.szJSON_OBJECT_OPEN);
                         sbOut.println(sbHeader.toString());
                    sbOut.println(CONST.szJSON_COLS_OPEN);
                         sbOut.println(dataTableColumns(multipletimeseriesOpCols()));
                    sbOut.println(CONST.szJSON_COLS_CLOSE);
                    sbOut.println(CONST.szJSON_ROWS_OPEN);
                         multipletimeseriesOpRows(mapQF(qual),sbOut, getCloudWatchData(cn,namespace,mapQ(qual),offset,hours,period,node,aws_env,aws_reg) );
                    sbOut.println(CONST.szJSON_ROWS_CLOSE);
                    sbOut.println(CONST.szJSON_OBJECT_CLOSE);
                    out.println(sbOut.toStringClean());
                    break; 
               case "forward":
                         String quickURL="p1?op=performance&env=" + aws_env;
                         req.setAttribute("quickURL", quickURL);
                         RequestDispatcher dispatcher = getServletContext().getRequestDispatcher("/zed.jsp");
                         dispatcher.forward(req, resp);
                    break; 

               default:
                    break; 
          }


          // USED TO BE HERE ----- out.println("}");

        } catch (Exception e) {
            UTIL.sysOut("Caught Exception: "+ e.getMessage());
            e.printStackTrace(System.out);
        }
    }

private String cleanString(String sz) {
     String clean = sz.replaceAll("\r", "").replaceAll("\n", "");
     return(sz);
}

private int mapQF(String sz) {
     int nRet = 1;
     int b=1024;
     int e=3;
     switch (sz) {
          case "statuscheck":
               nRet = -1;
               break; 
          case "diskreadbytes":
          case "diskwritebytes":
          case "netout":
          case "netoutmulti":
          case "netin":
          case "netinmulti":
               nRet = 1024*1024;
               break; 
          case "diskreadops":
          case "diskwriteops":
               nRet = 1;
               break; 
     }
    return (nRet);
}
private String mapQ(String sz) {
     String szRet = "";
     switch (sz) {
               case "StatusCheckFailed":
               case "statuscheckfailed":
               case "statuscheck":
                     szRet="StatusCheckFailed";
                     break; 
               case "CPUUtilization":
               case "cpuutilization":
               case "cpu":
               case "cpumulti":
               case "cpuavg":
                     szRet="CPUUtilization";
                     break; 
               case "NetworkOut":
               case "networkout":
               case "netout":
               case "netoutmulti":
                     szRet="NetworkOut";
                     break; 
               case "NetworkIn":
               case "networkin":
               case "netin":
               case "netinmulti":
                     szRet="NetworkIn";
                     break; 
               case "readbytes":
               case "DiskReadBytes":
               case "diskreadbytes":
               case "diskreadbytesmulti":
                     szRet="DiskReadBytes";
                     break; 
               case "writebytes":
               case "DiskWriteBytes":
               case "diskwritebytes":
               case "diskwritebytesmulti":
                     szRet="DiskWriteBytes";
                     break; 
               case "DiskReadOps":
               case "readops":
               case "diskreadops":
               case "diskreadopsmulti":
                     szRet="DiskReadOps";
                     break; 
               case "DiskWriteOps":
               case "writeops":
               case "diskwriteops":
               case "diskwriteopsmulti":
                     szRet="DiskWriteOps";
                     break; 
               case "system":
                     szRet=CONST.M_SYSTEM;
                     break; 
               case "status":
                    szRet=CONST.M_INSTANCE;
                     break; 
               case "MemoryAvailable":
               case "mema":
                     szRet="MemoryAvailable";
                     break; 
               case "MemoryUtilization":
               case "memz":
                     szRet="MemoryUtilization";
                     break; 
               case "MemoryUsed":
               case "memu":
                     szRet="MemoryUsed";
                     break; 
     }
    return (szRet);
}


// UTILS
public void CSVHeadersDefs(MyPrintWriter out, List <String> list) {
     String d="";
     String type="string";
     String pattern = "00$";
     Pattern r = Pattern.compile(pattern);
     Pattern h = Pattern.compile("X$");
     for (String i:list) {
          String sz = i;
          Matcher m = r.matcher(sz);
          if ( m.find() ) {
               type="number";
               sz = sz.replaceAll("00$", "");
          }
          out.print(d + sz);
          d = ",";
     }
     out.print("\n");
}
// TABLEHEADER
// TABLECOL
public String dTC(List <String> list) {
     return( dataTableColumns(list) );
}
public String dataTableColumns(List <String> list) {
     StringBuilder sb = new StringBuilder();
     Integer ct = 0;
     String d="";
     String type="string";
     String pattern = "00$";
     Pattern r = Pattern.compile(pattern);
     Pattern dd = Pattern.compile("11$");
     Pattern h = Pattern.compile("X$");
     for (String i:list) {
          String sz = i;
          Matcher m = r.matcher(sz);
          if ( m.find() ) {
               type="number";
               sz = sz.replaceAll("00$", "");
          }
          if ( dd.matcher(sz).find() ) {
               type="datetime";
               sz = sz.replaceAll("11$", "");
          }
          String field = String.format("F%02d", ct++);
          // MOEMOE
          sb.append(d + q3(co(dq("id"),dq(field)),co(CONST.szDQLABEL,dq(sz)), co(CONST.szDQTYPE,dq(type))));
//          sb.append(d + "{" + dq("x") + ":" + dq(field) + "," + dq("y") + ":" +   sz + "}");
          d = ",\n";
     }
//     sb.insert(0,"[");
//     sb.append("]");
     return( sb.toString() );
}
public void tableHeadersDefs(MyPrintWriter out, List <String> list) {
     String d="";
     String type="string";
     String pattern = "00$";
     Pattern r = Pattern.compile(pattern);
     Pattern h = Pattern.compile("X$");
     for (String i:list) {
          String sz = i;
          Matcher m = r.matcher(sz);
          if ( m.find() ) {
               type="number";
               sz = sz.replaceAll("00$", "");
          }
          //if (i.equals("state")) type="number";
          out.print(d + q3(co(dq("id"),dq(i.hashCode())),co(CONST.szDQLABEL,dq(sz)), co(CONST.szDQTYPE,dq(type))));
          d = ",\n";
     }
     out.println("],");
     out.println(dq("rows") + ": [");
}

public static String dq(String sz) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append("\"").append((sz==null) ? "-" : sz).append("\"").toString());
}
public static String dq(int n) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(n).append(CONST.DQ).toString());
}
public static String dq(Date d) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(d).append(CONST.DQ).toString());
}
public static String dq(Double dd) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(dd).append(CONST.DQ).toString());
}
public static String dq(long ddd) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(ddd).append(CONST.DQ).toString());
}
public String dqcomma(int n) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(n).append(CONST.DQ).append(CONST.COMMA).toString());
}
public String dqcomma(Date d) { return "\""+d+"\",";  }
public String dqcomma(Double dd) { return "\""+dd+"\",";  }
public String dqcomma(long ddd) { return "\""+ddd+"\",";  }

public String nvcomma(String name, String value) { 
     // sbHeader.appendln(dqcolon("uid")  + dqcomma("arn-12345a"));
     StringBuilder sb = new StringBuilder();
     return (
             sb.append("\"").append(UTIL.nonull(name)).append("\": ")
               .append(CONST.DQ).append(UTIL.nonull(value)).append("\",").toString()
            );
}
public String dqcomma(String sz) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(UTIL.nonull(sz)).append("\",").toString());
}
public String dqcolon(String sz) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append("\"").append(UTIL.nonull(sz)).append("\": ").toString());
}
public static String sr(String sz) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append("[").append(sz).append("]").toString());
}
public String sgco(String sz1, String sz2) { 
     StringBuilder sb = new StringBuilder();
     return (sb.append("{").append(sz1).append(":").append(sz2).append("}").toString());
}
public static String sgvco(String sz1) { 
     StringBuilder sb = new StringBuilder();
     //return (sb.append("{").append(CONST.szDQV).append(":").append(sz1).append("}").toString());
     return (sb.append(CONST.szSQDQVCO).append(sz1).append("}").toString());
}
public static String sgvcodq(String sz1) { 
     StringBuilder sb = new StringBuilder();
     // return (sb.append("{").append(CONST.szDQV).append(":\"").append(sz1).append("\"}").toString());
     return (sb.append(CONST.szSQDQVCODQ).append(sz1).append("\"}").toString());
}
public static String sgvcodq(int sz1) { 
     StringBuilder sb = new StringBuilder();
     //return (sb.append("{").append(CONST.szDQV).append(":\"").append(Integer.toString(sz1)).append("\"}").toString());
     return (sb.append(CONST.szSQDQVCODQ).append(Integer.toString(sz1)).append("\"}").toString());
}

public String sgvf(String sz) { return "{\"v\": "+sz + ", \"f\": \"" + sz + "\"" + " }"; }


public String co(String sz1, String sz2) { 
     StringBuilder sb = new StringBuilder();
     sb.append(sz1).append(":").append(sz2);
     return sb.toString();
}
public String dqco(String sz1, String sz2) { 
     StringBuilder sb = new StringBuilder();
     sb.append(dq(sz1)).append(":").append(dq(sz2));
     return sb.toString();
}
public String q3(String sz1, String sz2, String sz3) { return "{" + sz1 + "," + sz2 + "," + sz3 + "}";  }
public List <String> multipletimeseriesOpCols() {
     return(Arrays.asList("timestamp","max00","min00","avg00"));
}
private void multipletimeseriesOpRows(int factor, MyStringBuilder sb, List<Datapoint> list)  {
     String delim="";
     String c=",";
     String firstUnalteredTimeStamp = "XXXX";
     DecimalFormat df = new DecimalFormat("##0.00");
     for (Datapoint dp : list) {
          String szTS = dp.getTimestamp().toString();
          if (szTS.equals("XXXX")) firstUnalteredTimeStamp = szTS;
          String[] parts = szTS.split(" ");
          String[] parts2 = parts[parts.length-3].split(":");
          String szAbrev = parts2[parts2.length-3]+":"+parts2[parts2.length-2];
          String sz = "";
          if ( factor == -1 )
            sz = delim +"{" +  dq("c") + ":" +
            sr( sgvco(dq(szAbrev))  +c+ 
              sgvco(dq(df.format(dp.getMaximum()+1))) +c+
              sgvco(dq(df.format(dp.getMinimum()+1))) +c+
              sgvco(dq(df.format(dp.getAverage()+1))) 
            )  + "}";
          else
           sz = delim +"{" +  dq("c") + ":" +
           sr( sgvco(dq(szAbrev))  +c+ 
              sgvco(dq(df.format(dp.getMaximum()/factor))) +c+
              sgvco(dq(df.format(dp.getMinimum()/factor))) +c+
              sgvco(dq(df.format(dp.getAverage()/factor))) 
            )  + "}";

          sb.append(sz);
          delim = ",\n";
     }
     // out.println("],");
     // out.println(dqco("firsttimestamp", getFirstMetricTimeStamp(list)) +",");
     // out.println(dqco("lasttimestamp", getLastMetricTimeStamp(list)));
}
public List <String> zeekOpCols() {
     return(Arrays.asList("account","charge00"));
}
public List <String> singletimeseriesOpCols(String name) {
     return(Arrays.asList("timestamp11",name+"00"));
}
public List <String> OpCols(String... args) {
     List<String> list = new ArrayList<String>(8);
     for (int i=0;i<(args.length);i++) {
          list.add(args[i]);
     }
     return(list);
}


public List <String> singleseriesOpCols(String label,String name) {
     return(Arrays.asList(label,name));
}
public List <String> singletimeseriesOpCols() {
     return(Arrays.asList("timestamp11","value00"));
}
private static void singledpOpRows(int factor, MyStringBuilder sb, List<Datapoint> list,String name)  {
     DecimalFormat df = new DecimalFormat("##0.00");
     Datapoint dp = null;
     for (Datapoint thisdp : list) dp = thisdp; 
          Double zerg = 0.0d;
          String szTS = "";
          try {
               zerg = dp.getMaximum();
               // Tue Feb 03 07:45:00 EST 2015
               szTS = dp.getTimestamp().toString();
          } catch (Exception e) {
          } finally {
          }
          String sz = "{" +  dq("c") + ":" +
          sr( sgvco(dq(name))  +","+ sgvco(dq(df.format(zerg/factor))) )  +""+ "}";
          sb.append(sz);
}
private static void zookOpRows(String env,int factor, MyStringBuilder sb, List<Datapoint> list)  {
     String delim="";
     DecimalFormat df = new DecimalFormat("##0.00");
     Datapoint dp = null;
     for (Datapoint thisdp : list) dp = thisdp; 
          Double zerg = 0.0d;
          String szTS = "";
          try {
               zerg = dp.getMaximum();
               // Tue Feb 03 07:45:00 EST 2015
               szTS = dp.getTimestamp().toString();
          } catch (Exception e) {
          } finally {
          }
          String sz = delim + sr( "" + dq(env)  + "," + df.format(zerg/factor) )  + "";
          sb.append(sz);
          delim = ",\n";
}
private static void zeekOpRows(String env,int factor, MyStringBuilder sb, List<Datapoint> list)  {
     String delim="";
     DecimalFormat df = new DecimalFormat("##0.00");
     Datapoint dp = null;
     for (Datapoint thisdp : list) dp = thisdp; 
          Double zerg = 0.0d;
          String szTS = "";
          try {
               zerg = dp.getMaximum();
               // Tue Feb 03 07:45:00 EST 2015
               szTS = dp.getTimestamp().toString();
          } catch (Exception e) {
          } finally {
          }
          String sz = delim +"{" +  dq("c") + ":" +
          sr( sgvco(dq(env))  +","+ sgvco(dq(df.format(zerg/factor))) )  +""+ "}";
          sb.append(sz);
          delim = ",\n";
}
private static void singletimeserieslastdpOpRows(int factor, MyStringBuilder sb, List<Datapoint> list)  {
     String delim="";
     DecimalFormat df = new DecimalFormat("##0.00");
     Datapoint dp = null;
     for (Datapoint thisdp : list) dp = thisdp; 
          Double zerg = 0.0d;
          String szTS = "";
          try {
               zerg = dp.getMaximum();
               // Tue Feb 03 07:45:00 EST 2015
               szTS = dp.getTimestamp().toString();
          } catch (Exception e) {
          } finally {
          }
          String sz = delim +"{" +  dq("c") + ":" +
          sr( sgvco(dq("last"))  +","+ sgvco(dq(df.format(zerg/factor))) )  +""+ "}";
          sb.append(sz);
          delim = ",\n";
}
//SERIESOP
// OPSERIES
// var data = [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 17 }, { x: 3, y: 42 } ];
//Date now = new java.util.Date();
private static void singletimeseriesFakeDataOpRows(int factor, MyStringBuilder sb)  {
    List<String> FAKEDATA = new ArrayList<String>();
    for (int i=0;i<16;i++) 
       FAKEDATA.add(Helper.randomNumericString(3));
     String delim="";
     int i = 0;
     for (String szV : FAKEDATA) {
          Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("America/New_York"));
          calendar.setTime( new java.util.Date() );
          String szDay   = Integer.toString(calendar.get(Calendar.DAY_OF_MONTH)); 
          String szMonth = Integer.toString(calendar.get(Calendar.MONTH)); 
          String szYear  = Integer.toString(calendar.get(Calendar.YEAR)); 
          String szHour  = Integer.toString(calendar.get(Calendar.HOUR_OF_DAY)); 
          //String szMinute  = Integer.toString(calendar.get(Calendar.MINUTE)+(i++)); 
          String szMinute  = Integer.toString(1+(i++)); 
          String szSecond  = Integer.toString(calendar.get(Calendar.SECOND)); 
          String jsonTS = "Date("+szYear+","+szMonth+","+szDay+","+szHour+","+szMinute+","+szSecond+")";
          String sz = delim +"{" +  dq("c") + ":" + sr( sgvco(dq(jsonTS))  +","+ sgvco(dq(szV)) )  +""+ "}";
          sb.append(sz);
          delim = ",";
     }
}



private static void singletimeseriesOpRows2(int factor, MyStringBuilder sb, List<Datapoint> list)  {
     String delim="";
     DecimalFormat df = new DecimalFormat("##0.00");
     for (Datapoint dp : list) {
          Double zerg = dp.getMaximum();
          // Tue Feb 03 07:45:00 EST 2015
          String szTS = dp.getTimestamp().toString();
          String szTime = Long.toString( dp.getTimestamp().getTime() );
          Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("America/New_York"));
          calendar.setTime( dp.getTimestamp() );
          String szDay   = Integer.toString(calendar.get(Calendar.DAY_OF_MONTH)); 
          String szMonth = Integer.toString(calendar.get(Calendar.MONTH)); 
          String szYear  = Integer.toString(calendar.get(Calendar.YEAR)); 
          String szHour  = Integer.toString(calendar.get(Calendar.HOUR_OF_DAY)); 
          String szMinute  = Integer.toString(calendar.get(Calendar.MINUTE)); 
          String szSecond  = Integer.toString(calendar.get(Calendar.SECOND)); 
          // myChart.addTimeAxis("x", "Date", "%Y-%m-%d %H:%M:%S", "%Y-%m");
          // myTimeAxis.tickFormat = "%Y-%m";
          // http://dimplejs.org/advanced_examples_viewer.html?id=advanced_time_axis 
          // https://stackoverflow.com/questions/20195870/dimple-time-format-juggling 
          String jsonTS = szYear+ "-" +szMonth+ "-" +szDay+ " " +szHour+ ":" +szMinute+ ":" +szSecond;
          String[] parts = szTS.split(" ");
          String pn=parts[1];
          if ( parts[1].equals("Jan") ) pn="01-";
          if ( parts[1].equals("Feb") ) pn="02-";
          String day = pn + parts[2] + " ";
          String[] parts2 = parts[parts.length-3].split(":");
          String szAbrev = day + parts2[parts2.length-3]+":"+parts2[parts2.length-2];
          String sz = delim +"{" +  dq("x") + ":" + dq(jsonTS)  + "," + dq("y") + ":" +  dq(df.format(zerg/factor)) + "}";
          sb.append(sz);
          // MOEMOE
          delim = ",\n";
     }
}
private static void singletimeseriesOpRows(int factor, MyStringBuilder sb, List<Datapoint> list)  {
     String delim="";
     DecimalFormat df = new DecimalFormat("##0.00");
     for (Datapoint dp : list) {
          Double zerg = dp.getMaximum();
          // Tue Feb 03 07:45:00 EST 2015
          String szTS = dp.getTimestamp().toString();
          String szTime = Long.toString( dp.getTimestamp().getTime() );
          // TimeStamp is java.util.Date
          // Date(year, month, day[,hour, minute, second[, millisecond]]) 
          // where everything after day is optional, and months are zero-based.
          Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("America/New_York"));
          calendar.setTime( dp.getTimestamp() );
          String szDay   = Integer.toString(calendar.get(Calendar.DAY_OF_MONTH)); 
          String szMonth = Integer.toString(calendar.get(Calendar.MONTH)); 
          String szYear  = Integer.toString(calendar.get(Calendar.YEAR)); 
          String szHour  = Integer.toString(calendar.get(Calendar.HOUR_OF_DAY)); 
          String szMinute  = Integer.toString(calendar.get(Calendar.MINUTE)); 
          String szSecond  = Integer.toString(calendar.get(Calendar.SECOND)); 
          String jsonTS = "Date("+szYear+","+szMonth+","+szDay+","+szHour+","+szMinute+","+szSecond+")";
          String[] parts = szTS.split(" ");
          String pn=parts[1];
          if ( parts[1].equals("Jan") ) pn="01-";
          if ( parts[1].equals("Feb") ) pn="02-";
          String day = pn + parts[2] + " ";
          String[] parts2 = parts[parts.length-3].split(":");
          String szAbrev = day + parts2[parts2.length-3]+":"+parts2[parts2.length-2];
          //String sz = delim +"{" +  dq("c") + ":" + sr( sgvco(dq(szAbrev))  +","+ sgvco(dq(df.format(zerg/factor))) )  +""+ "}";
          //String sz = delim +"{" +  dq("c") + ":" + sr( sgvco(dq(szTime))  +","+ sgvco(dq(df.format(zerg/factor))) )  +""+ "}";
          String sz = delim +"{" +  dq("c") + ":" + sr( sgvco(dq(jsonTS))  +","+ sgvco(dq(df.format(zerg/factor))) )  +""+ "}";
          sb.append(sz);
          // MOEMOE
          delim = ",\n";
     }
}
private static void singletimeseriesOpRowsSecondForm(int factor, MyStringBuilder sb, List<Datapoint> list)  {
     String delim="";
     DecimalFormat df = new DecimalFormat("##0.00");
     long t = 1000L;
     for (Datapoint dp : list) {
          Double zerg = dp.getMaximum();
          long epoch  = dp.getTimestamp().getTime() / t;
          String sz =  delim + "{"+ dq("x") + ":" + epoch + "," + dq("y") + ":" + df.format(zerg/factor) + "}";
          sb.append(sz);
          delim = ",";
     }
}

public List <String> valueOpCols() {
     return(Arrays.asList("name","value"));
}
// OTTO
public int valueOpRows(int nn, MyStringBuilder sb, List <String> list) {
     int ct = 0;
     String c = ",";
     String delim="";
     if (nn >0) delim=",";
     for (String i:list) {
               ct++;
               String sz = delim + "{" +  dq("c") + ":";
               sz =  sz + sr(
                              UTIL.json("name") +c+ 
                              UTIL.json(i) 
                            )  +"}"  ;
               sb.append(sz);
               delim= ",\n";
     }
     return(ct);
}
public List <String> servicesOpCols() {
     return(Arrays.asList("name","value"));
}
public List <String> usersOpCols() {
     return(Arrays.asList("env","username","create","last","arn"));
}
// groups
// public int usus(AmazonIdentityManagementClient conn
//                              sgvcodq(sb.toString()) 
public int usersOpRows(int nn, DLCConnect cn, String region, MyStringBuilder sb, List <User> list) {
     int ct = 0;
     String c = ",";
     String delim="";
     if (nn >0) delim=",";
     for (User i:list) {
               //ListGroupsForUserRequest uur = new ListGroupsForUserRequest(i.getUserName());
               //List<Group> groups = conn.listGroupsForUser(uur).getGroups();
               //         Collections.sort(groups, new Comparator<Group>() {
	       //                    @Override
	       //                    public int compare(Group i1, Group i2) {
               //                    return i1.getGroupName().compareTo(i2.getGroupName());
	       //                    }
	       //         });
               //String ud="";
               //StringBuilder sb = new StringBuilder();
               //int k=0;
               //for (Group g:groups) {
               //      sb.append(ud).append(g.getGroupName());
               //      ud=" ";
               //}

               ct++;
               MyTimeStamp tsCreate = new MyTimeStamp(i.getCreateDate());
               MyTimeStamp tsLast = new MyTimeStamp(i.getPasswordLastUsed());
               String jsondata = UTIL.concatter("[", "]", ",", 
                              UTIL.json(cn.getIAMEnvMapped()),
                              UTIL.json(i.getUserName()),
                              UTIL.json(tsCreate.value()),
                              UTIL.json((i.getPasswordLastUsed() != null) ? tsLast.value() : "="),
                              UTIL.json(i.getArn()) );
               sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
               delim= ",\n";
     }
     return(nn+list.size());
}
// http://docs.awsB.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/services/sqs/AmazonSQSClient.html#getQueueAttributes%28java.lang.String,%20java.util.List%29
public int imim(AmazonEC2Client conn, int nn, String acct, String region, MyPrintWriter out, List <Reservation> list) {
     int ct = 0;
     String c = ",";
     String delim="";
     String NME="";
     if (nn >0) delim=",";
     for (Reservation res:list) {
       List <Instance> instancelist = res.getInstances();
       for (Instance inst:instancelist) {
          List <Tag> t1 =inst.getTags();
          for (Tag teg:t1)  if ( teg.getKey().equals("Name") )   NME = teg.getValue();
          DescribeImagesRequest imagereq = new DescribeImagesRequest();
          List<String> imageIds = Arrays.asList(inst.getImageId());
          imagereq.setImageIds(imageIds);
          List<Image> imagelist = conn.describeImages(imagereq).getImages();
          for (Image i:imagelist) {
               ct++;
               String sz = delim + "{" +  dq("c") + ":";
               sz =  sz + sr( 
                              sgvcodq(NME) +c+
                              sgvcodq(i.getImageId()) +c+
                              sgvcodq(i.getName()) +c+
                              sgvcodq(i.getDescription())
                            )  +"}"  ;
               out.print(sz);
               delim= ",\n";
          }
       }
     }
     return(ct);
}

public List <String> performanceOpCols() {
     return(Arrays.asList("IDENTITY","envreg","tag","status","type","id","name","purpose","performance"));
}
public int performanceOpRows(int nn, DLCConnect cn,MyStringBuilder sb ,List <InstanceX> list) {
     int ct = 0;
     String c = ",";
     String delim= "";
     if (nn >0) delim=",\n";
     for (InstanceX ie:list){
       if ( ie.getStatus().equals("R")) {
          ct++;
          String sz = delim + "{" +  dq("c") + ":";
          sz =  sz + sr( 
               ie.getIdentityJson() +c+
               ie.getEnvRegJson() +c+
               ie.getTagJson() +c+
               ie.getStatusJson() +c+
               ie.getInstanceTypeJson() +c+
               ie.getIdJson() +c+
               ie.getNameJson() +c+
               ie.getPurposeJson() +c+
               UTIL.json("")
          )  +"}"  ;
          sb.append(sz);
          delim= ",\n";
      }
     }
     return(nn+ct);
}
public String  fakeIdentityStrJson(String a,String b,String c,String d,String e)  { return (a+","+ b+","+ c+","+ d+","+ e); }
    
public List <String> testdataOpCols() {
     String sz="vCPU,mem,strg,net,ebs";
     return(Arrays.asList("field-1","field-2","field-3","field-4"));
}
public List <String> protoOpCols() {
     return(Arrays.asList("a","b","c","d"));
}
public int protoOpRows(int nn, DLCConnect cn, MyStringBuilder sb, String a, String b, String c, String d) {
     int ct = 0;
     String cc = ",";
     String delim= "";
     if (nn >0) delim=",";
          ct++;
          String sz = delim + "{" +  dq("c") + ":";
          sz =  sz + sr( 
               UTIL.json(a) +cc+
               UTIL.json(b) +cc+
               UTIL.json(c) +cc+
               UTIL.json(d)
          )  +"}"  ;
          sb.append(sz);
          delim= ",\n";
     return(nn+ct);
}
public List <String> fakeOpCols() {
     String sz="vCPU,mem,strg,net,ebs";
     return(Arrays.asList("IDENTITY","sel","instance","tag","purpose","field-4","field-5","field-6","field-7","name","filed-9",
     "field-10","field-11","field-12","field-13","field-14","$hour","fielda1","fielda2","field-18","filed-19"));
}
public int testdataOpRows(int nn, DLCConnect cn,MyStringBuilder sb) {
     int ct = 0;
     int n = 0;
     String c = ",";
     String delim= "";
     if (nn >0) delim=",";
     int n0 = 4;
     for (int i=0;i<4;i++){
          ct++;
          String sz = delim + "{" +  dq("c") + ":";
          sz =  sz + sr( 
               UTIL.json("AA") +c+
               UTIL.json("BB") +c+
               UTIL.json("CC") +c+
               UTIL.json("DD")
          )  +"}"  ;
          sb.append(sz);
          delim= ",\n";
     }
     return(nn+ct);
}
public int fakeOpRows(int nn, DLCConnect cn,MyStringBuilder sb) {
     int ct = 0;
     int n = 0;
     String c = ",";
     String szsz = "";
     String delim= "";
     if (nn >0) delim=",";
     int nData = new Random().nextInt(12)+1;
     if ( nData <=0 ) nData = 1;
     int n0 = nData;
     for (int i=0;i<12;i++){
           szsz = szsz + "<option>" + Helper.randomString( new Random().nextInt(6)+1 ) + "</option>";
     }
     for (int i=0;i<nData;i++){
          ct++;
          String sz = delim + "{" +  dq("c") + ":";
          String aa= Helper.randomString( new Random().nextInt(6)+1 );
          String bb= Helper.randomString( new Random().nextInt(6)+1 );
          String cc= Helper.randomString( new Random().nextInt(6)+1 );
          String dd= Helper.randomString( new Random().nextInt(6)+1 );
          String ee= Helper.randomString( new Random().nextInt(6)+1 );
          String ff= Helper.randomString( new Random().nextInt(6)+1 );
          
          sz =  sz + sr( 
               UTIL.json(fakeIdentityStrJson(aa,bb,cc,dd,ee)) +c+
               UTIL.json(UTIL.HTMLselect(szsz)) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+
               UTIL.json(randy()) +c+

               UTIL.json(Helper.randomDollar( new Random().nextInt(6)+1 ) ) +c+
               UTIL.json(Helper.randomDollar( new Random().nextInt(6)+1 ) ) +c+
               UTIL.json(Helper.randomDollar( new Random().nextInt(6)+1 ) ) +c+
               UTIL.json(Helper.randomString( new Random().nextInt(6)+1 ) ) +c+
               UTIL.json(Helper.randomString( new Random().nextInt(6)+1 ) )
          )  +"}"  ;
          sb.append(sz);
          delim= ",\n";
     }
     return(nn+ct);
}
public String randy() {
          String ff= Helper.randomString( new Random().nextInt(6)+1 );
          if ( (new Random().nextInt(10)+1) <= 4) {
               ff="";
               if ( (new Random().nextInt(10)+1) <= 5) ff="-"; 
          }
          return ff;
}
public List <String> lastCostOpCols() {
     return(Arrays.asList("env","timestamp","cost","delta","30days@delta"));
}
private int lastCostOpRows(int nn,String env,int factor, MyStringBuilder sb, List<Datapoint> list)  {
     // DecimalFormat df = new DecimalFormat("##0.00");
     DecimalFormat df = new DecimalFormat("##0");
     int ct = 0;
     String jsondata = "";
     String delim= "";
     if (nn >0) delim=",";
     int nFirst = 0;
     Double ferg = 0.0d;
     for (Datapoint dp : list) {
          Double zerg = 0.0d;
          String szTS = "";
          try {
               zerg = dp.getMaximum();
               if ( nFirst == 0 ) {
                    ferg =  dp.getMaximum();
                    nFirst = 1;
               } else {
                    if (dp.getMaximum() < ferg)
                         ferg =  dp.getMaximum();
               }
               // Tue Feb 03 07:45:00 EST 2015
               szTS = dp.getTimestamp().toString();
               ct++;
               jsondata = UTIL.concatter("[", "]", ",", 
                                   UTIL.json(env),
                                   UTIL.json(dp.getTimestamp().toString()),
                                   UTIL.json(df.format(zerg)),
                                   UTIL.json(df.format(zerg - ferg)),
                                   UTIL.json(df.format( (zerg - ferg)*30 ))
                                   );
               sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
               delim= ",\n";
               ferg =  dp.getMaximum();
          } catch (Exception e) {
          } finally {
          }
     }
     return(nn+ct);
}

public List <String> monthlyCostOpCols() {
     return(Arrays.asList("env","cost"));
}
private int monthlyCostOpRows(int nn,String env,int factor, MyStringBuilder sb, List<Datapoint> list)  {
     // DecimalFormat df = new DecimalFormat("##0.00");
     DecimalFormat df = new DecimalFormat("##0");
     int ct = 0;
     String jsondata = "";
     String delim= "";
     if (nn >0) delim=",";

     Datapoint dp = null;
     for (Datapoint thisdp : list) dp = thisdp; 
     // for (Datapoint thisdp : list) {
          Double zerg = 0.0d;
          String szTS = "";
          try {
               zerg = dp.getMaximum();
               // Tue Feb 03 07:45:00 EST 2015
               szTS = dp.getTimestamp().toString();
          } catch (Exception e) {
          } finally {
          }
          ct++;
          jsondata = UTIL.concatter("[", "]", ",", UTIL.json(env),UTIL.json(df.format(zerg/factor)));
          sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
          delim= ",\n";
     // }
     return(nn+ct);
}
public List <String> inventoryrawOpCols() {
     String sz="vCPU,mem,strg,net,ebs";
     return(Arrays.asList("IDENTITY","env","reg","type","id","az","name","purpose"));
}
public int inventoryrawOpRows(HttpServletRequest req, int nn, DLCConnect cn,MyStringBuilder sb ,List <InstanceX> list) {
     int ct = 0;
     String key = "Bar12345Bar12345"; // 128 bit key
     String initVector = "RandomInitVector"; // 16 bytes IV
     String jsondata = "";
     String delim= "";
     String csvdata = "env,reg,type,id,az,name,purpose";
     delim= "";
     if (nn >0) delim=",";
     for (InstanceX ie:list){
          ct++;
          jsondata = UTIL.concatter("[", "]", ",", 
               ie.getIdentityJson(),
               ie.getMappedEnvJson(),
               ie.getRegJson(),
               ie.getInstanceTypeRawJson(),
               ie.getIdRawJson(),
               ie.getAZJson(),
               ie.getNameJson(),
               ie.getPurposeJson()  );

          csvdata = csvdata + "\n" + UTIL.concatter("", "", ",", 
               ie.getMappedEnv(),
               ie.getReg(),
               ie.getInstanceTypeRaw(),
               ie.getIdRaw(),
               ie.getAZ(),
               ie.getName(),
               ie.getPurpose()  );

          sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
          delim= ",\n";
     }
     req.getSession(true).setAttribute("csv", csvdata); 
     return(nn+ct);
}
public List <String> inventoryminusOpCols() {
     String sz="vCPU,mem,strg,net,ebs";
     return(Arrays.asList("IDENTITY","env","reg","tag","s","type","id","name","purpose","config","strg","launch","dd","$hour","$day","$mon","$strg","$all"));
}
public int inventoryminusOpRows(int nn, DLCConnect cn,MyStringBuilder sb ,List <InstanceX> list) {
     int ct = 0;
     String key = "Bar12345Bar12345"; // 128 bit key
     String initVector = "RandomInitVector"; // 16 bytes IV
     String jsondata = "";
     String delim= "";
     if (nn >0) delim=",";
     for (InstanceX ie:list){
          ct++;
          jsondata = UTIL.concatter("[", "]", ",", 
               ie.getIdentityJson(),
               ie.getMappedEnvJson(),
               ie.getRegJson(),
               ie.getTagJson(),
               ie.getStatusJson(),
               ie.getInstanceTypeRawJson(),
               ie.getIdCleanJson(),
               ie.getNameJson(),
               ie.getPurposeJson(),
               ie.getInstanceBOMJson(),
               ie.getVolumeSizeJson(), 
               ie.getLaunchDateJson(),
               ie.getLaunchDeltaDaysJson(),
               ie.getPriceJson(),
               ie.getPrice24Json(),
               ie.getPrice30DayMonthJson(),
               UTIL.json(ie.getStorageCostString()), 
               UTIL.json(ie.getAllCostString()) );
          sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
          delim= ",\n";
     }
     return(nn+ct);
}
public List <String> costOpCols() {
     String sz="vCPU,mem,strg,net,ebs";
     return(Arrays.asList("env","reg","tag","id","sta","name","purpose","$hour"));
}
public int costOpRows(int nn, DLCConnect cn,MyStringBuilder sb ,List <InstanceX> list) {
     int ct = 0;
     String jsondata = "";
     String delim= "";
     if (nn >0) delim=",";
     for (InstanceX ie:list){
          ct++;
          jsondata = UTIL.concatter("[", "]", ",", 
               ie.getMappedEnvJson(),
               ie.getRegJson(),
               ie.getStatusJson(),
               ie.getIdCleanJson(),
               ie.getTagJson(),
               ie.getNameJson(),
               ie.getPurposeJson(),
               ie.getPriceJson());
          sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
          delim= ",\n";
     }
     return(nn+ct);
}

public List <String> S3BucketsOpCols() {
     return(Arrays.asList("env","bucket-name"));
}
public int alexaS3BucketsOpRows(AmazonS3Client conn, int nn, String env, MyStringBuilder sb, List <Bucket> list) {
     int ct = 0;
     String sz = "";
     String delim= "";
     if (nn >0) delim=",";
     for (Bucket i:list) {
          ct++;
          sb.append( i.getName() + " " );
          delim= ",\n";
     }
     return(nn+ct);
}
public int S3BucketsOpRows(AmazonS3Client conn, int nn, String env, MyStringBuilder sb, List <Bucket> list) {
     int ct = 0;
     String sz = "";
     String delim= "";
     if (nn >0) delim=",";
     for (Bucket i:list) {
          ct++;
          sz = UTIL.concatter("[", "]", ",",UTIL.json(env),UTIL.json(i.getName()));
          sb.append(delim).append("{").append(CONST.DQCDQCO).append(sz).append("}");
          delim= ",\n";
     }
     return(nn+ct);
}
public int S3BucketCountOpRows(AmazonS3Client conn, int nn, String env, MyStringBuilder sb, List <Bucket> list) {
     int ct = 0;
     for (Bucket i:list) {
          ct++;
     }
     String sz = "{" +  dq("c") + ":";
     sz =  sz + sr(
                   UTIL.json(env) +","+
                   UTIL.json(ct)
                  )  +"}"  ;
     sb.append(sz);
     return(ct);
}

public List <String> tagOpCols() {
     String sz="vCPU,mem,strg,net,ebs";
     return(Arrays.asList("env","reg","tag","count"));
}
public int tagOpRows(int nn, DLCConnect cn,MyStringBuilder sb ,List <InstanceX> list) {
     Map<String, Integer> map = new HashMap<String, Integer>();
     int ct = 0;
     String jsondata = "";
     String delim= "";
     if (nn >0) delim=",";
     for (InstanceX ie:list) {
          if (map.get(ie.getTag()) == null ) map.put(ie.getTag(), 0);
          int n = map.get(ie.getTag()) + 1;
          map.put(ie.getTag(), n);
     }


     for (Map.Entry<String, Integer> entry : map.entrySet()) {
          ct++;
          jsondata = UTIL.concatter("[", "]", ",", 
                     UTIL.json(cn.getEC2EnvMapped()),
                     UTIL.json(cn.getEC2Reg()),
                     UTIL.json(entry.getKey()),
                     UTIL.json(entry.getValue()));
          sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
          delim= ",\n";
     }
     return(nn+ct);
}


public List <String> beansOpCols() {
     return(Arrays.asList("env","reg","name","description","createdate", "updatedate"));
}

public int beansOpRows(int nn, DLCConnect cn, String acct,String region, MyStringBuilder sb) {
     AWSElasticBeanstalkClient conn  =   cn.ConnectEBS(acct,region);
     int ct = 0;
     String jsondata = "";
     String delim= "";
     if (nn >0) delim=",";
     DescribeApplicationsResult dar = conn.describeApplications();
     List<ApplicationDescription> beanlist = dar.getApplications();
     for (ApplicationDescription eb:beanlist){
          ct++;
          jsondata = UTIL.concatter("[", "]", ",", 
               UTIL.json(cn.getEBSEnvMapped()),
               UTIL.json(cn.getEBSReg()),
               UTIL.json(UTIL.nonewlines(eb.getDescription())),
               UTIL.json(eb.getApplicationName()),
               UTIL.json( (new MyTimeStamp(eb.getDateCreated())).value()),
               UTIL.json( (new MyTimeStamp(eb.getDateUpdated())).value()));
          sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
          delim= ",\n";
     }
     return(nn+ct);
}

public List <String> inventoryRDSOpCols() {
     return(Arrays.asList("db-name","status","id","db-name","engine","engine-ver","create-time"));
}
public int inventoryRDSOpRows(int nn, DLCConnect cn,MyStringBuilder sb ,List <DBInstance> list) {
     int ct = 0;
     UTIL.debug_on();
     String jsondata = "";
     String delim= "";
     if (nn >0) delim=",";
     for (DBInstance c:list){
          ct++;
          jsondata = UTIL.jsonconcatter("[", "]", ",", 
                     c.getDBName(),
                     c.getDBInstanceStatus(),
                     c.getDbiResourceId(),
                     c.getDBName(),
                     c.getEngine(),
                     c.getEngineVersion(),
                     c.getInstanceCreateTime().toString());

          sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
          delim= ",\n";
     }
     return(nn+ct);
}
public List <String> inventoryRedshiftOpCols() {
     return(Arrays.asList("cluster-id","node-type","node-count",
                          "node-role","PrivIP","PubIP","vpc","db-name","status","verison","create-time"));
}
public int inventoryRedshiftOpRows(int nn, DLCConnect cn,MyStringBuilder sb ,List <Cluster> list) {
     int ct = 0;
     UTIL.debug_on();
     String jsondata = "";
     String delim= "";
     if (nn >0) delim=",";
     for (Cluster c:list){
          ct++;
          List<ClusterNode> nodes = c.getClusterNodes();
          for (ClusterNode n:nodes) {
               String nodelist  = n.getNodeRole() + " " + n.getPrivateIPAddress() + "/" + n.getPublicIPAddress();
               jsondata = UTIL.jsonconcatter("[", "]", ",", 
                        c.getClusterIdentifier(),
 	                c.getNodeType(),
                        Integer.toString(c.getNumberOfNodes()),
                        n.getNodeRole(),
                        n.getPrivateIPAddress(),
                        n.getPublicIPAddress(),
                        c.getVpcId(),
                        c.getDBName(), 
                        c.getClusterStatus(),
                        c.getClusterVersion(),
                        c.getClusterCreateTime().toString() );
               sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
               delim= ",\n";
          }
     }
     return(nn+ct);
}

public List <String> inventoryOpCols() {
     String sz="vCPU,mem,strg,net,ebs";
     return(Arrays.asList("IDENTITY","env","reg","tag","s","type","$hour","ami-","launch","dd","id","name","purpose","config",
"owner","devices","network","sg","cpu","netin","netout"));
}
public int inventoryOpRows(HttpServletRequest req, int nn, DLCConnect cn,MyStringBuilder sb ,List <InstanceX> list) {
     int ct = 0;
     String key = "Bar12345Bar12345"; // 128 bit key
     String initVector = "RandomInitVector"; // 16 bytes IV
     String jsondata = "";
     String delim= "";
     String csvdata = "";
     List <String> csvcols=Arrays.asList("env","reg","tag","s","type","$hour","ami-","launch","dd","id","name","purpose");
     csvdata = listConcatter(csvcols, csvdata, ",");
     if (nn >0) delim=",";

     UTIL.debug_on();

     for (InstanceX ie:list){
          StringBuilder sbConfig = new StringBuilder();
          sbConfig.append(ie.getInstanceBOM()).append(",");
          sbConfig.append(ie.getVolumeSize()).append(",");
          sbConfig.append(ie.getAllCostString()).append("");
          ct++;
          jsondata = UTIL.concatter("[", "]", ",", 
               ie.getIdentityJson(),
               ie.getMappedEnvJson(),
               ie.getRegJson(),
               ie.getTagJson(),
               ie.getStatusJson(),
               ie.getInstanceTypeJson(),
               ie.getPriceJson(),
               ie.getImageIdJson(),
               ie.getLaunchDateJson(),
               ie.getLaunchDeltaDaysJson(),
               ie.getIdCleanJson(),
               ie.getNameJson(),
               ie.getPurposeJson(),
               UTIL.json(sbConfig.toString()), 
               UTIL.json(UTIL.HTMLselect(Cache.getInstanceOwnerOptionMap(ie.getId()))),
               UTIL.json(UTIL.HTMLselect(Cache.getInstanceBDMOptionMap(ie.getId()))),
               UTIL.json(UTIL.HTMLselect(Cache.getInstanceIPOptionMap(ie.getId()))),
               UTIL.json(UTIL.HTMLselect(Cache.getSecurityGroupOptionMap( "sg-"+ ie.getSecurityGroupByMode(0) ))),
               ie.getSecurityGroupByModeJson(0),
               UTIL.json(""),
               UTIL.json(""),
               UTIL.json("")
                   );
          csvdata = csvdata + "\n" + UTIL.concatter("", "", ",", 
               ie.getMappedEnv(),
               ie.getReg(),
               ie.getTag(),
               ie.getStatus(),
               ie.getInstanceType(),
               ie.getPrice(),
               ie.getImageId(),
               ie.getLaunchDate(),
               ie.getLaunchDeltaDays(),
               ie.getId(),
               ie.getName(),
               ie.getPurpose());
          sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
          delim= ",\n";
     }
     req.getSession(true).setAttribute("csv", csvdata); 
     return(nn+ct);
}
public List <String> inventoryplusOpCols() {
     String sz="vCPU,mem,strg,net,ebs";
     return(Arrays.asList("IDENTITY","env","reg","tag","s","type","id","name","purpose","dv","stg","stgcst","owner",
                          "config","prv","pub","vpc","launch","key","$hour","$day","$all","subnet-","ami-","sg-","cpu"));
}
public int inventoryplusOpRows(int nn, DLCConnect cn,MyStringBuilder sb ,List <InstanceX> list) {
     int ct = 0;
     String jsondata = "";
     String delim= "";
     if (nn >0) delim=",";
     for (InstanceX ie:list){
          ct++;
          jsondata = UTIL.concatter("[", "]", ",", 
               ie.getIdentityJson(),
               ie.getMappedEnvJson(),
               ie.getRegJson(),
               ie.getTagJson(),
               ie.getStatusJson(),
               ie.getInstanceTypeJson(),
               ie.getIdCleanJson(),
               ie.getNameJson(),
               ie.getPurposeJson(),
               ie.getDeviceVolumesJson(),
               ie.getVolumeSizeJson(), 
               UTIL.json(Double.toString(ie.getStorageCost())), 
               ie.getOwnerCleanJson(),
               ie.getInstanceBOMJson(),
               ie.getIpPrivateJson(),
               ie.getIpPublicJson(),
               ie.getVpcIdJson(),
               ie.getLaunchDateJson(),
               ie.getKeyPairJson(),
               ie.getPriceJson(),
               ie.getPrice24Json(),
               UTIL.json(ie.getAllCostString()), 
               ie.getSubnetIdJson(),
               ie.getImageIdJson(),
               ie.getSecurityGroupByModeJson(0),
               UTIL.json(""));
          sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
          delim= ",\n";
     }
     return(nn+ct);
}
/*

               ie.getIdentityJson() +c+
               ie.getEnvRegJson() +c+
               ie.getTagJson() +c+
               ie.getStatusJson() +c+
               ie.getInstanceTypeJson() +c+
               ie.getIdCleanJson() +c+
               ie.getNameJson() +c+
               ie.getPurposeJson() +c+
               ie.getOwnerCleanJson() +c+
               ie.getInstanceBOMJson() +c+
               ie.getIpPrivateJson() +c+
               ie.getIpPublicJson() +c+
               ie.getVpcIdJson() +c+
               ie.getLaunchDateJson() +c+
               ie.getKeyPairJson() +c+
               ie.getPriceJson() +c+
               ie.getPrice24Json() +c+
               ie.getSubnetIdJson() +c+
               ie.getImageIdJson() +c+
               ie.getSecurityGroupByModeJson(0) +c+
               UTIL.json("")
*/
public List <String> diskstorageOpCols() {
                    return(Arrays.asList("gb"));
}
public int diskstorageOpRows(int nn, MyStringBuilder sb, DLCConnect dc, List <Volume> list) {
     int ct = 0;
     int n = 0;
     String c = ",";
     String delim="";
     if (nn >0) delim=",";
     for (Volume i:list) n = n + i.getSize();
               ct++;
               String sz = delim + "{" +  dq("c") + ":";
               sz =  sz + sr( 
                              UTIL.json(n)
                            )  +"}"  ;
               sb.append(sz);
               delim= ",\n";
     return(ct);
}

public String listConcatter(List <String> list, String sz, String delim) {
     String d = "";
     for (String i:list) { sz = sz + d + i; d=delim; }
     return sz;
}
public List <String> volumesOpColsOld() {
                    return(Arrays.asList("env","reg","volid","tag","device","purpose","type","create","days-up","size","$month","az",
                                         "instance","sta","name","device","snap"));
}
public List <String> volumesOpCols() {
                    return(Arrays.asList("env","reg","tag","vm-instance","purpose","volume-id","create","days-up","$month","device","size-gb"));
}   
public int volumesOpRows(HttpServletRequest req, int nn, MyStringBuilder sb, DLCConnect dc, List <Volume> list) {
     int ct = 0;
     String c = ",";
     String delim="";
     String szIops = "";
     String szCost = "";
     String vid="";
     String did="";
     String iid="";
     String sta="";
     String istatus="";
     String nid="";
     String jsondata="";
     String csvdata="";
     csvdata = listConcatter(volumesOpCols(), csvdata, ",");
     //for (String i:volumesOpCols()) { 
     //     csvdata = csvdata + delim + i;
     //     delim=",";
    // }
     delim="";
     DecimalFormat df = new DecimalFormat("##0");
     if (nn >0) delim=",";
     for (Volume i:list) {
               vid="";
               did="";
               iid="";
               nid="";
               sta="";

                Map<String, String>     tagmap  = new HashMap<String, String>(64);
                for (Tag teg:i.getTags()) tagmap.put(teg.getKey(), teg.getValue());
                // Helper.getKeyMap(tagmap,"Owner","-");
                // Helper.getKeyMap(tagmap,"Name","-");
                // Helper.getKeyMap(tagmap,"Host_Name","-");
                // Helper.getKeyMap(tagmap,"Purpose","-");
                // this.ownerfiltered = this.owner.replaceAll("[AaEeIiOoUuYy]","");
                // java.util.Date
                Date createdate = i.getCreateTime();
                MyTimeStamp createtimestamp = new MyTimeStamp(createdate);
                // from JDK to Joda
                DateTime jodadatetimecreate = new DateTime(createdate);
                DateTime jodadatetimenow    = new DateTime();
                Duration duration           = new Duration(jodadatetimecreate, jodadatetimenow);
                long     createdeltahours   = duration.getStandardHours();
                long     createdeltadays    = duration.getStandardDays();

if ( 1 == 0 ) {
               List <VolumeAttachment> 	vava = i.getAttachments();
               for (VolumeAttachment va:vava) {
                    vid = vid + va.getInstanceId();
                    did = did + va.getDevice();
                    InstanceQ q = new InstanceQ(dc, va.getInstanceId());
                    // iid = iid + q.getId();
                    iid = iid + va.getInstanceId();
                    istatus = InstanceX.mapInstanceState(q.getInstance().getState().getName());
                    nid = nid + q.getName();
               }
}
               for (VolumeAttachment va:i.getAttachments()) {
                    iid = va.getInstanceId();
                    did = va.getDevice();
                    //if (!(iid.equals(""))) {
                    //     InstanceQ q = new InstanceQ(dc, iid);
                    //     nid = q.getName();
                    //     sta = q.getStatus();
                    //}
                    nid = "nid";
                    sta = "sta";
               }

               szIops =  "NA";
               szIops = (i.getVolumeType().equals("standard")) ? "NA" : Integer.toString(i.getIops());
               szCost = (i.getVolumeType().equals("standard")) ? 
                                         df.format(i.getSize()*0.10).toString()
                                         : 
                                         df.format((i.getIops()*0.065)+(i.getSize()*0.125)).toString();
         //  CONCATTER
         //  sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
         //  String jsondata = UTIL.concatter("[", "]", ",", 
         //                     UTIL.json(i.getAvailabilityZone()),
             ct++;
             jsondata = UTIL.concatter("[", "]", ",", 
                              UTIL.json(dc.getEC2EnvMapped()),
                              UTIL.json(dc.getEC2Reg()),
                              UTIL.json(Helper.getKeyMap(tagmap,Custom.getTagNameString(),"-")),
                              UTIL.json(iid.replace("i-","")),
                              UTIL.json(Helper.getKeyMap(tagmap,"Purpose","-")),
                              UTIL.json(i.getVolumeId().replace("vol-","") ),
                              UTIL.json(createtimestamp.value()),
                              UTIL.json(Long.toString(createdeltadays)),
                              UTIL.json(szCost),
                              UTIL.json(did),
                              UTIL.json(Integer.toString(i.getSize()))
                );
             csvdata = csvdata + "\n" + UTIL.concatter("", "", ",", 
                              UTIL.nothing(dc.getEC2EnvMapped()),
                              UTIL.nothing(dc.getEC2Reg()),
                              UTIL.nothing(Helper.getKeyMap(tagmap,Custom.getTagNameString(),"-")),
                              UTIL.nothing(iid.replace("i-","")),
                              UTIL.nothing(Helper.getKeyMap(tagmap,"Purpose","-")),
                              UTIL.nothing(i.getVolumeId().replace("vol-","") ),
                              UTIL.nothing(createtimestamp.value()),
                              UTIL.nothing(Long.toString(createdeltadays)),
                              UTIL.nothing(szCost),
                              UTIL.nothing(did),
                              UTIL.nothing(Integer.toString(i.getSize()))
                );
               sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
               delim= ",\n";
     }
     req.getSession(true).setAttribute("csv", csvdata); 
     return(ct+nn);
}

public List <String> sgOpCols() {
                    return(Arrays.asList("env","reg","id","name","perms"));
}
public int sgOpRows(int nn, DLCConnect cn, MyStringBuilder sb, List <SecurityGroup> list) {
     int ct = 0;
     String c = ",";
     String delim="";
     String htmlbr="";
     String jsondata="";
     if (nn >0) delim=",";
     for (SecurityGroup i:list) {
               String PERMS="";
               String pp = "";
               pp="<font family='courier'><pre>";
               List<IpPermission> iplist = i.getIpPermissions();
if ( 1 == 1) {
               for (IpPermission j:iplist) {
                        String protocol = j.getIpProtocol();
                        Integer fromPort;
                        Integer toPort;
                        String szFromPort = "";
                        String szToPort = "";
	                try {
                             szFromPort = (j.getFromPort() == -1) ? "allICMP" : j.getFromPort().toString();
                             szToPort   = (j.getToPort()   == -1) ? "allICMP" : j.getToPort().toString();
	                } catch (Exception e) {
                             szFromPort = "X";
                             szToPort   = "X";
	                } finally {
                        }
                        switch (protocol) {
                             case ("udp"):
                             case ("tcp"):
                             case ("icmp"):
                                  break;
                             default:
                                  protocol = "PROTOCOL["+protocol+"]"; 
                                  break;
                        }
                       
                        int k = 1;
                        int npadp = 22;
                        int npad = 19;
                        pp = pp + htmlbr+UTIL.padder(protocol+":"+szFromPort+":"+szToPort,npadp);
                        htmlbr="<br>";
                        List<String> ipRanges = j.getIpRanges();
                        if ( 1 == 0 ) {
                        Collections.sort(ipRanges, new Comparator<String>() {
	                           @Override
	                           public int compare(String i1, String i2) {
                                   return i1.compareTo(i2);
	                           }
	                });
                        }
                        if ( ipRanges.size() == 0) pp=pp+UTIL.padder("NO RANGES",npad);
                        for (String s:ipRanges) {
                             if (((k++) % 12== 0)) pp=pp+"<br>"+UTIL.padder("",npadp);
                             if ( s.equals("0.0.0.0/0") ) 
                                  pp=pp+"<font color=Red>" + UTIL.padder(s,npad) + "</font>";  
                             else
                                  pp=pp+UTIL.padder(s,npad);
                        }
               }
               pp=pp+"</pre></font>";
               ct++;
               jsondata = UTIL.concatter("[", "]", ",", 
                              UTIL.json(cn.getEC2EnvMapped()),
                              UTIL.json(cn.getEC2Reg()) ,
                              UTIL.json(i.getGroupId()),
                              UTIL.json(i.getGroupName()),
                              UTIL.json(pp)  );
               sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
               delim= ",\n";
     }}
     return(nn+ct);
}


public void AmazonServiceExceptionHandler(AmazonServiceException ase) {
     UTIL.sysOut("Caught: AmazonServiceException, which means your request made it to SQS, but was rejected with an error response for some reason.");
     UTIL.sysOut("Error Message:    " + ase.getMessage());
     UTIL.sysOut("HTTP Status Code: " + ase.getStatusCode());
     UTIL.sysOut("AWS Error Code:   " + ase.getErrorCode());
     UTIL.sysOut("Error Type:       " + ase.getErrorType());
     UTIL.sysOut("Request ID:       " + ase.getRequestId());
}
public void AmazonClientExceptionHandler(AmazonClientException ace) {
     UTIL.sysOut("Caught AmazonClientException, which means the client encountered a serious internal problem trying to communicate with SQS.");
     UTIL.sysOut("Error Message: " + ace.getMessage());
}

public List <String> queueTestDeleteOpCols() {
     return(Arrays.asList("ok"));
}
public int queueTestDeleteOpRows(int nn, DLCConnect cn, MyStringBuilder sb, List <String> list,String spec) {
     AmazonSQSClient conn  =   cn.ConnectSQS(cn.getEnv(),cn.getRegion());
     int ct = 0;
     String c = ",";
     for (String i:list) {
            // *************************************************************************************** 
            ReceiveMessageRequest receiveMessageRequest = new ReceiveMessageRequest(i);
            List<Message> messages = conn.receiveMessage(receiveMessageRequest).getMessages();
            for (Message message : messages) {
                UTIL.sysOut("  Message");
                UTIL.sysOut("    MessageId:     " + message.getMessageId());
                // UTIL.sysOut("    ReceiptHandle: " + message.getReceiptHandle());
                UTIL.sysOut("    MD5OfBody:     " + message.getMD5OfBody());
                UTIL.sysOut("    Body:          " + message.getBody());
                for (Entry<String, String> entry : message.getAttributes().entrySet()) {
                    UTIL.sysOut("  Attribute");
                    UTIL.sysOut("    Name:  " + entry.getKey());
                    UTIL.sysOut("    Value: " + entry.getValue());
                }
	        try {
                     // *************************************************************************************** 
                     // Delete a message
                     if ( i.equals(spec)) {
                          // UTIL.sysOut("Deleting a message.");
                          conn.deleteMessage(new DeleteMessageRequest(i, message.getReceiptHandle()));
                     }

                }
                catch (AmazonServiceException ase) { 
                     AmazonServiceExceptionHandler(ase);
                } catch (AmazonClientException ace) {
                     AmazonClientExceptionHandler(ace);
                }
            }
            UTIL.sysOut();
            //  String messageReceiptHandle = messages.get(0).getReceiptHandle();
            //  conn.deleteMessage(new DeleteMessageRequest(i, messageReceiptHandle));
     }
     sb.append( sr( UTIL.json("OK") )  +"}" );
     return(nn+ct);
}
public List <String> queueTestAddOpCols() {
     return(Arrays.asList("ok"));
}
//OTTO
public int queueTestAddOpRows(int nn, DLCConnect cn, MyStringBuilder sb, List <String> list,String spec, int msgct) {
     AmazonSQSClient conn  =   cn.ConnectSQS(cn.getEnv(),cn.getRegion());
     int ct = 0;
     String c = ",";
     UTIL.assert_on();
     UTIL.assertion(!spec.equals(""),"spec is a NULL STRING");
     for (String i:list) {
               // *************************************************************************************** 
               // Send a set of message(s)
               if (UTIL.regex(i,spec)) {
                    // int kt = (new Random().nextInt()+1);
                    int kt = 1024;
                    if (msgct > 0) kt = msgct;
          	    for (int k=0; k < kt; k++) {
                         String sz = Helper.randomString(16);
                         conn.sendMessage(new SendMessageRequest(i, sz));
                    }
               }
               // *************************************************************************************** 
     }
     sb.append( sr( UTIL.json("OK") )  +"}" );
     return(nn+ct);
}

public List <String> queueOpCols() {
     return(Arrays.asList("env","reg","qurl","notviz","delayed","retain","arn","maxmsgsize","name","msgs"));
}

public int queueOpRows(int nn, DLCConnect cn, MyStringBuilder sb, List <String> list) {
     UTIL.debug_off();
     AmazonSQSClient conn  =   cn.ConnectSQS(cn.getEnv(),cn.getRegion());
     int ct = 0;
     String c = ",";
     String delim="";
     if (nn >0) delim=",";
     for (String i:list) {
               ct++;
               List<String> attr = Arrays.asList("All");
               GetQueueAttributesResult  qr = conn.getQueueAttributes(i, attr); 
               Map<String,String> mp = qr.getAttributes();
               String[] parts = mp.get("QueueArn").split(":");
               String QueueName = parts[parts.length-1];
               String QueueArn = mp.get("QueueArn");
               String jsondata = UTIL.concatter("[", "]", ",", 
                              UTIL.json(cn.getMappedEnv()),
                              UTIL.json(cn.getRegion()),
                              UTIL.json(i),
                              UTIL.json(mp.get("ApproximateNumberOfMessagesNotVisible")),
                              UTIL.json(mp.get("ApproximateNumberOfMessagesDelayed")),
                              UTIL.json(mp.get("MessageRetentionPeriod")),
                              UTIL.json(QueueArn),
                              UTIL.json(mp.get("MaximumMessageSize")),
                              UTIL.json(QueueName),
                              UTIL.json(mp.get("ApproximateNumberOfMessages")) );
               sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
               delim= ",\n";
     }
     return(nn+ct);
}
public List <String> groupsOpCols() {
     return(Arrays.asList("env","groupname","arn","createdate","users"));
}
public int groupsOpRows(int nn, DLCConnect cn, MyStringBuilder sb, List <Group> list) {
     AmazonIdentityManagementClient conn  = cn.ConnectIAM(cn.getIAMEnv());
     int ct = 0;
     String c = ",";
     String delim="";
     if (nn >0) delim=",";
     for (Group i:list) {
               ct++;
               String sz = delim + "{" +  dq("c") + ":";
               GetGroupRequest ggr = new GetGroupRequest(i.getGroupName());
               List<User> groupusers = conn.getGroup(ggr).getUsers();
                        Collections.sort(groupusers, new Comparator<User>() {
	                           @Override
	                           public int compare(User i1, User i2) {
                                   return i1.getUserName().compareTo(i2.getUserName());
	                           }
	                });
               String ud="";
               StringBuilder sbt = new StringBuilder();
               for (User ug:groupusers) {
                     sbt.append(ud).append(ug.getUserName());
                     ud=", ";
               }
               MyTimeStamp ts = new MyTimeStamp(i.getCreateDate());
               String jsondata = UTIL.concatter("[", "]", ",", 
                              UTIL.json(cn.getIAMEnvMapped()),
                              UTIL.json(i.getGroupName()),
                              UTIL.json(i.getArn()),
                              UTIL.json(ts.value()),
                              UTIL.json(sbt.toString())  );
               sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
               delim= ",\n";
     }
     return(nn+ct);
}
public List <String> rolesOpCols() {
     return(Arrays.asList("env","name","create","arn"));
}

public int rolesOpRows(int nn, DLCConnect cn, MyStringBuilder sb, List <Role> list) {
     int ct = 0;
     String delim="";
     if (nn >0) delim=",";
     for (Role i:list) {
               ct++;
               String sz = delim + "{" +  dq("c") + ":";
               MyTimeStamp ts = new MyTimeStamp(i.getCreateDate());
               String jsondata = UTIL.concatter("[", "]", ",", 
                              UTIL.json(cn.getIAMEnvMapped()),
                              UTIL.json(i.getRoleName()),
                              UTIL.json(ts.value()),
                              UTIL.json(i.getArn()) );
               sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
               delim= ",\n";
     }
     return(nn+ct);
}

public List <String> tagsOpCols() {
                    return(Arrays.asList("env","reg","instance","name","tags"));
}
public int tagsOpRows(int nn, DLCConnect cn, MyStringBuilder sb, List <InstanceX> list) {
     int ct = 0;
     String c = ",";
     String delim="";
     if (nn >0) delim=",";
     String anchor="";
     String anchor2="JSON";
          for (InstanceX ie:list){
               Instance i = ie.getInstance();
               String szRegion = ie.getRegion();
               String NME = "";
               String PRP = "";
               String SG = "";
               String BDM="";
               String  ddlm = "";
               
               ddlm = "";
               List <Tag> t1 =i.getTags();
                    Collections.sort(t1, new Comparator<Tag>() {
	            @Override
	            public int compare(Tag i1, Tag i2) {
                        return i1.getKey().compareTo(i2.getKey());
	            }
	        });
               ddlm = "";
               for (Tag teg:t1)  {
                    NME = NME + escape(ddlm + teg.getKey() + " - " + teg.getValue());
                    ddlm = "<br>";
               }
               ct++;
               String sz = delim + "{" +  dq("c") + ":";
               MyTimeStamp ts = new MyTimeStamp(i.getLaunchTime());
               sz =  sz + sr( 
                              ie.getMappedEnvJson() +c+
                              ie.getRegionJson() +c+
                              UTIL.json(i.getInstanceId()) +c+
                              ie.getNameJson() +c+
                              UTIL.json(escape(NME)) 
                            )  +"}"  ;
               sb.append(sz);
               delim= ",\n";
     }
     return(nn+ct);
}
	/**
	 * Escape quotes, \, /, \r, \n, \b, \f, \t and other control characters (U+0000 through U+001F).
	 * @param s
	 * @return
	 */
	public String escape(String s){
	if(s==null) return null;
        StringBuffer sb = new StringBuffer();
        escape(s, sb);
        return sb.toString();
    }



    /**
     * @param s - Must not be null.
     * @param sb
     */
    static void escape(String s, StringBuffer sb) {
    	final int len = s.length();
		for(int i=0;i<len;i++){
			char ch=s.charAt(i);
			switch(ch){
			case '"':
				sb.append("\\\"");
				break;
			case '\\':
				sb.append("\\\\");
				break;
			case '\b':
				sb.append("\\b");
				break;
			case '\f':
				sb.append("\\f");
				break;
			case '\n':
				sb.append("\\n");
				break;
			case '\r':
				sb.append("\\r");
				break;
			case '\t':
				sb.append("\\t");
				break;
			case '/':
				sb.append("\\/");
				break;
			default:
                //Reference: http://www.unicode.org/versions/Unicode5.1.0/
				if((ch>='\u0000' && ch<='\u001F') || (ch>='\u007F' && ch<='\u009F') || (ch>='\u2000' && ch<='\u20FF')){
					String ss=Integer.toHexString(ch);
					sb.append("\\u");
					for(int k=0;k<4-ss.length();k++){
						sb.append('0');
					}
					sb.append(ss.toUpperCase());
				}
				else{
					sb.append(ch);
				}
			}
		}//for
	}
public List <String> instanceStorageOpCols() {
     return(Arrays.asList("tag","status","type","id","name","dev","vols","total","cost","sizes","ucost","envreg"));
}
public int instanceStorageOpRows(int nn, DLCConnect cn, MyStringBuilder sb, List <InstanceX> list) {
     long startTime = System.currentTimeMillis();
     int ct = 0;
     String c = ",";
     String delim="";
     String szNewCol = "{" +  dq("c") + ":";
     if (nn >0) delim=",";
          for (InstanceX ie:list){
               Instance i = ie.getInstance();
               String  ddlm = "";
               ct++;
               String sz = delim + szNewCol;
               sz =  sz + sr( 
                              ie.getTagJson() +c+
                              ie.getStatusJson() +c+
                              ie.getInstanceTypeJson() +c+
                              ie.getIdJson() +c+
                              ie.getNameJson() +c+
                              ie.getDevicesJson() +c+
                              UTIL.json(ie.getDeviceSummaryString()) +c+
                              UTIL.json(ie.getStorage()) +c+
                              UTIL.json(ie.getStorageCost()) +c+
                              UTIL.json(ie.getUnitStorageSummary()) +c+
                              UTIL.json(ie.getUnitCostStorageSummary()) +c+
                              ie.getEnvRegJson()
                            )  +"}"  ;
               sb.append(sz);
               delim= ",\n";
     }
     long endTime = System.currentTimeMillis();
     cn.duration = (endTime - startTime);
     return(nn+ct);
}
public int instanceCount(int nn, MyPrintWriter out, List <InstanceX> list) {
     int ct = 0;
     String c = ",";
     String delim="";
     int all=0;
     int pending=0;
     int running=0;
     int shuttingdown=0;
     int terminated=0;
     int stopping=0;
     int stopped=0;
     String env = "";
     if (nn >0) delim=",\n";
     all = list.size();
     for (InstanceX i:list) {
               env = i.getEnv();
               switch (i.getStateCode()) {
               case (0):
                    pending++;
                    break;
               case (16):
                    running++;
                    break;
               case (32):
                    shuttingdown++;
                    break;
               case (48):
                    terminated++;
                    break;
               case (64):
                    stopping++;
                    break;
               case (80):
                    stopped++;
                    break;
               }
     }
     ct++;
     String sz = delim + "{" +  dq("c") + ":";
     sz =  sz + sr( 
          sgvcodq(env) +c+
          sgvcodq(all) +c+
          sgvcodq(pending) +c+
          sgvcodq(running) +c+
          sgvcodq(shuttingdown) +c+
          sgvcodq(terminated) +c+
          sgvcodq(stopping) +c+
          sgvcodq(stopped)
     )  +"}"  ;
     out.print(sz);
     delim= ",\n";
     return(ct);
}
public List <String> instanceCountOpCols() {
     return(Arrays.asList("acct","instances","running","string","cpu","mem"));
}
public int instanceCountOpRows(int n, String acct, String region, MyStringBuilder sb, List <Reservation> list) {
     int j = 0;
     int ct = 0;
     int tct = n;
     int cpu = 0;
     int cpu_running = 0;
     Double mem = 0.0;
     int ctrunning = 0;
     String delim="";
     MyStringBuilder sbRet = new MyStringBuilder();
     for (Reservation res:list){
          List <Instance> instancelist = res.getInstances();
          for (Instance i:instancelist) {
                ct++;
                if (i.getState().getCode() == 16) ctrunning++;
                j = Integer.parseInt(InstanceX.getCPUCountString(i.getInstanceType()));
                cpu = cpu + j;
                if (i.getState().getCode() == 16) cpu_running = cpu_running + j;
                mem = mem + Double.parseDouble(InstanceX.getMEMCountString(i.getInstanceType()));
          }
     }
     sbRet.append(acct);
     sbRet.append(": ");
     sbRet.append(ctrunning);
     sbRet.append("/");
     sbRet.append(ct);
     sbRet.append("   ");
     if (tct > 0 ) delim = ",\n";
     tct++;
     String jsondata = UTIL.concatter("[", "]", ",", 
                   UTIL.json(acct),
                   UTIL.json(ct),
                   UTIL.json(ctrunning),
                   UTIL.json(sbRet.toString()),
                   UTIL.json(Integer.toString(cpu)),
                   UTIL.json(Integer.toString(cpu_running)),
                   UTIL.json(Integer.toString( (int) Math.ceil(mem) )) );
     sb.append(delim).append("{").append(CONST.DQCDQCO).append(jsondata).append("}");
     return(tct);
}
// @getCloudWatchData2
private void addDimension(List<Dimension> list, String name, String value) {
     Dimension d = new Dimension();
     d.setName(name);
     d.setValue(value);
     list.add(d); 
}

//GETCLOUDWATCHBILLINGDATA
private List<Datapoint> getCloudWatchBillingData2(DLCConnect cn,String aws_env, String aws_reg, String thisDim)  {
     int ct = 0;
     String delim = "";
     Custom custom = new Custom();
     List<String> stats = Arrays.asList("Average","Maximum","Minimum");
     // List<String> stats = Arrays.asList("Maximum");
     int hours =  24*2;
     int period = 60*60;
     if (hours <=0) hours = 24;
     if (period <=0) period = 60;
     long offsetInMilliseconds = 1000 * 60 * 60 * hours;
     List<Dimension> dimensionList = new ArrayList<Dimension>();
          if (! thisDim.equals("")) addDimension(dimensionList,"ServiceName",thisDim);
          addDimension(dimensionList,"LinkedAccount",custom.getAccountNumber(aws_env));
          addDimension(dimensionList,"Currency","USD");
     GetMetricStatisticsRequest request = new GetMetricStatisticsRequest();
     request.setNamespace("AWS/Billing");
     request.setMetricName("EstimatedCharges");
     request.setStatistics(stats);
     request.setDimensions(dimensionList);
     AmazonCloudWatchClient cloudWatch = null;
     cloudWatch = cn.ConnectCloudWatch( custom.getConsolidatedBillingEnv(aws_env), aws_reg);
     List<Datapoint> list = new ArrayList<Datapoint>();
     //Joda Time
     DateTime dateTime = new DateTime();
     int HN = 0;
     int N = 1;


          request.setPeriod(60*60*24);
          // START TIME
          //DateTime startTime = (new DateTime()).minusHours(24);
          MutableDateTime startTime = new MutableDateTime();
          startTime.setZone(DateTimeZone.UTC);
          startTime.addMonths(0);
          //startTime.setDayOfMonth(1);
          startTime.setMillisOfDay(0);
          startTime.addHours(-1 * (24 * 7) );
          request.setStartTime(startTime.toDate());
          // END TIME
          //DateTime endTime = (new DateTime()).minusHours(0);
          MutableDateTime endTime = new MutableDateTime();
          endTime.setZone(DateTimeZone.UTC);
          endTime.addMonths(0);
          //endTime.setDayOfMonth(1);
          endTime.setMillisOfDay(0);
          endTime.addHours(0);
          request.setEndTime( endTime.toDate());
          GetMetricStatisticsResult r = cloudWatch.getMetricStatistics(request);
          list.addAll(r.getDatapoints()); 

                    Collections.sort(list, new Comparator<Datapoint>() {
	            @Override
	            public int compare(Datapoint i1, Datapoint i2) {
                        return i1.getTimestamp().compareTo(i2.getTimestamp());
	            }
	        });
          // int nFirst = 0;
          //Double nLast = 0.0;
          //for (Datapoint dp:list)  {
          //if ( nFirst == 0 ) {
          //    nLast = dp.getMaximum();
          //    nFirst = 1;
          //}
          //StringBuilder sb = new StringBuilder();
          //Double j = dp.getMaximum() - nLast;
          //sb.append(j.intValue());
          //UTIL.sysOut( dp.getTimestamp()
          //               + ", " + dp.getMaximum().toString() 
          //               + ", " + sb.toString()
          //);
          //nLast = dp.getMaximum();
     // }
     return (list);
}
private List<Datapoint> getCloudWatchBillingData(DLCConnect cn,String aws_env, String aws_reg, String thisDim)  {
     int ct = 0;
     String delim = "";
     Custom custom = new Custom();
     List<String> stats = Arrays.asList("Average","Maximum","Minimum");
     // List<String> stats = Arrays.asList("Maximum");
     int hours =  24*2;
     int period = 60*60;
     if (hours <=0) hours = 24;
     if (period <=0) period = 60;
     long offsetInMilliseconds = 1000 * 60 * 60 * hours;
     List<Dimension> dimensionList = new ArrayList<Dimension>();
          if (! thisDim.equals("")) addDimension(dimensionList,"ServiceName",thisDim);
          addDimension(dimensionList,"LinkedAccount",custom.getAccountNumber(aws_env));
          addDimension(dimensionList,"Currency","USD");
     GetMetricStatisticsRequest request = new GetMetricStatisticsRequest();
     request.setNamespace("AWS/Billing");
     request.setPeriod(period);
     request.setMetricName("EstimatedCharges");
     request.setStatistics(stats);
     request.setDimensions(dimensionList);
     AmazonCloudWatchClient cloudWatch = null;
     cloudWatch = cn.ConnectCloudWatch( custom.getConsolidatedBillingEnv(aws_env), aws_reg);
     List<Datapoint> list = new ArrayList<Datapoint>();
     //Joda Time
     DateTime dateTime = new DateTime();
     int HN = 0;
     int N = 1;
     if ( hours > 24 ) {
          N = hours / 24; 
          hours = 24;
     }
     for (int i=0;i<N;i++) {
          // END TIME
          // Typically Now, HN == ZERO
          request.setEndTime( (new DateTime()).minusHours(HN).toDate());

          // START TIME
          // A Time in the Past
          request.setStartTime( (new DateTime()).minusHours(HN+hours).toDate());
       		      UTIL.sysOut(Integer.toString(HN));
       		      UTIL.sysOut(">> "+thisDim+"  "+aws_env + "  " + custom.getConsolidatedBillingEnv(aws_env));
       		      UTIL.sysOut((new DateTime()).minusHours(HN+hours).toDate().toString());
       		      UTIL.sysOut((new DateTime()).minusHours(HN).toDate().toString());
       		      UTIL.sysOut("");

          GetMetricStatisticsResult r = cloudWatch.getMetricStatistics(request);
       		      UTIL.sysOut("[return]");
       		      UTIL.sysOut(      Integer.toString(r.getDatapoints().size()) );
          list.addAll(r.getDatapoints()); 
          HN = HN + hours;
     }
                    Collections.sort(list, new Comparator<Datapoint>() {
	            @Override
	            public int compare(Datapoint i1, Datapoint i2) {
                        return i1.getTimestamp().compareTo(i2.getTimestamp());
	            }
	        });
     return (list);
}
//
// @getCloudWatchData 
// GETCLOUDWATCHDATA
private List<Datapoint> getCloudWatchData(DLCConnect cn,String ns,String metric,int offset,int hours,int p, String nodeId,String aws_env, String aws_reg)  {
     int ct = 0;
     if (p == 1) p = 60;

     String namespace = "AWS/EC2";
     if (!ns.equals("")) namespace=ns;
     List<String> stats = Arrays.asList("Average","Maximum","Minimum");
     List<Datapoint> list = new ArrayList<Datapoint>();

     Dimension instanceDimension = new Dimension();
          instanceDimension.setName("InstanceId");
          instanceDimension.setValue(nodeId);
     GetMetricStatisticsRequest request = new GetMetricStatisticsRequest();
          request.setNamespace(namespace);
          request.setPeriod(p);
          request.setMetricName(metric);
          request.setStatistics(stats);
          request.setDimensions(Arrays.asList(instanceDimension));

     AmazonCloudWatchClient cloudWatch = cn.ConnectCloudWatch(aws_env, aws_reg);

     int HN = offset;
     int HE = hours;
     int N = 1;
     if ( hours > 24 ) {
          N = hours / 24; 
          HE = 24;
     }
     for (int i=0;i<N;i++) {
          //Joda Time
          // Typically Now
          Date end = new DateTime().minusHours(HN).toDate();
          request.setEndTime(end);
          // A Time in the Past
          Date start = new DateTime().minusHours(HN+HE).toDate();
          request.setStartTime(start);
          GetMetricStatisticsResult r = cloudWatch.getMetricStatistics(request);
          list.addAll(r.getDatapoints()); 
          //UTIL.sysOut(r.getDatapoints().toString() ); 
          HN = HN + HE;
     }

     Collections.sort(list, new Comparator<Datapoint>() {
          @Override
          public int compare(Datapoint i1, Datapoint i2) {
               return i1.getTimestamp().compareTo(i2.getTimestamp());
          }
     });

     return (list);
}


private String getFirstMetricTimeStamp(List<Datapoint> list)  {
     String firstUnalteredTimeStamp = "XXXX";
     for (Datapoint dp:list) if (firstUnalteredTimeStamp.equals("XXXX")) firstUnalteredTimeStamp = dp.getTimestamp().toString();
     return(firstUnalteredTimeStamp);
}
private String getLastMetricTimeStamp(List<Datapoint> list)  {
     String lastUnalteredTimeStamp = "XXXX";
     for (Datapoint dp:list) lastUnalteredTimeStamp = dp.getTimestamp().toString();
     return(lastUnalteredTimeStamp);
}
private void processCloudWatchData(List<Datapoint> list,MyPrintWriter out)  {
     Double up = 0.0;
     Double dn = 0.0;
     DecimalFormat df = new DecimalFormat("##0.0");
     for (Datapoint dp : list) {
          Double zerg = dp.getMaximum();
          if ( zerg == 0 ) up++;
          if ( zerg > 0 ) dn++;
     }
     String sz = "";
     sz =  "{" +  dq("c") + ":" + sr( sgco(dq("v"),dq("up")) +","+ sgco(dq("v"),Helper.dx(df.format(up))) )   +"},";
    out.println(sz);
     sz = "{" +  dq("c") + ":" + sr( sgco(dq("v"),dq("down")) +","+ sgco(dq("v"),Helper.dx(df.format(dn))) )   +"}";
    out.println(sz);
}

private void HeadersAndColumnsRowsOpen(MyStringBuilder sbOut, String szHeaders, String szColumns) {
     sbOut.println(CONST.szJSON_OBJECT_OPEN, szHeaders, CONST.szJSON_COLS_OPEN, szColumns, CONST.szJSON_COLS_CLOSE);
}

private String myDateStringFormat(String sz) {
     // Unmodified: Thu Oct 23 09:22:12 EDT 2014
     StringBuilder sb = new StringBuilder();
     String[] p = sz.split(" ");
     return sz;
     //return sb.append(p[1]).append(" ").append(p[2]).append(" ").append(p[3]).toString();
}

}
