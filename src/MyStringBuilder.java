import java.lang.StringBuilder;
import java.util.Date;

public class MyStringBuilder {
     private final DLCUtil UTIL = new DLCUtil();
     private static final DLCConst CONST = new DLCConst();

     private static final String DQ = "\"";
     private static final String NL = "\n";
     private static final String CR = "\r";
     private static final String COSP = ": ";
     private static final String COMMA = ",";
     private static final String COMMANL = ",\n";
     private static final String EMPTY = "";

     private Object preObj;

     StringBuilder sb;

     MyStringBuilder () {
          sb = new StringBuilder();
     }
     public MyStringBuilder print(String sz) {
          this.sb.append(sz);
          return(this);
     }
     public void output(MyPrintWriter out) {
          out.println(this.toString());
     }


     private void put(String sz) { 
          this.sb.append(sz); 
          this.sb.append(NL); 
     }
     private void put(String sz1,String sz2) { 
          this.sb.append(sz1); this.sb.append(NL); 
          this.sb.append(sz2); this.sb.append(NL); 
     }
     private void put(String sz1,String sz2,String sz3) { 
          this.sb.append(sz1); this.sb.append(NL); 
          this.sb.append(sz2); this.sb.append(NL); 
          this.sb.append(sz3); this.sb.append(NL); 
     }

     public MyStringBuilder printJsonObjectln(String sz) {
          put(CONST.szJSON_OBJECT_OPEN);
          put(sz);
          put(CONST.szJSON_COLS_OPEN);
          return(this);
     }
     public MyStringBuilder println(String sz) {
          this.sb.append(sz);
          this.sb.append(NL); 
          return(this);
     }
     public MyStringBuilder print(String... args) {
          for (int i=0;i<(args.length);i++) this.sb.append(args[i]);
          return(this);
     }
     public MyStringBuilder println(String... args) {
          for (int i=0;i<(args.length);i++) {
               this.sb.append(args[i]);
               this.sb.append(NL); 
          }
          return(this);
     }
     public MyStringBuilder insert(int n, String sz) {
          this.sb.insert(n,sz);
          return(this);
     }
     public MyStringBuilder insertln(int n, String sz) {
          this.sb.insert(n,sz + NL);
          return(this);
     }
     public MyStringBuilder prepend(String sz) {
          this.sb.insert(0,sz);
          return(this);
     }
     public MyStringBuilder prependln(String sz) {
          this.sb.insert(0,sz + NL);
          return(this);
     }
     public MyStringBuilder append(String sz) {
          this.sb.append(sz);
          return(this);
     }
     public MyStringBuilder append(String... args) {
          for (int i=0;i<(args.length);i++) this.sb.append(args[i]);
          return(this);
     }
     public MyStringBuilder JSON_NameValue(String... args) {
          for (int i=0;i<(args.length);i=i+2) {
               this.sb.append("\"").append(UTIL.nonull(args[i])).append("\": ").append(CONST.DQ).append(UTIL.nonull(args[i+1])).append("\",").append(NL);
          }
          return(this);
     }

     public MyStringBuilder appendln(String sz) {
          this.sb.append(sz);
          this.sb.append(NL);
          return(this);
     }
     public MyStringBuilder appendln(String... args) {
          for (int i=0;i<(args.length);i++) {
               this.sb.append(args[i]);
               this.sb.append(NL); 
          }
          return(this);
     }
     public MyStringBuilder append(int n) {
          this.sb.append(Integer.toString(n));
          return(this);
     }
     public MyStringBuilder append(int... args) {
          for (int i=0;i<(args.length);i++) this.sb.append(Integer.toString(args[i]));
          return(this);
     }


     public MyStringBuilder jsonNV(String name, int v) {
          this.sb.append(DQ).append(name).append(DQ).append(COSP).append(DQ).append(Integer.toString(v)).append(DQ).append(NL);
          return(this);
     }
     public MyStringBuilder jsonNVc(String name, int v) {
          this.sb.append(DQ).append(name).append(DQ).append(COSP).append(DQ).append(Integer.toString(v)).append(DQ).append(COMMANL);
          return(this);
     }
     public MyStringBuilder jsonNV(String name, String v) {
          this.sb.append(DQ).append(name).append(DQ).append(COSP).append(DQ).append(v).append(DQ).append(NL);
          return(this);
     }
     public MyStringBuilder jsonNVc(String name, String v) {
          this.sb.append(DQ).append(name).append(DQ).append(COSP).append(DQ).append(v).append(DQ).append(COMMANL);
          return(this);
     }
         
     public MyStringBuilder appendq(String sz) {
          this.sb.append(DQ);
          this.sb.append(sz);
          this.sb.append(DQ);
          return(this);
     }
     public MyStringBuilder appendqln(String sz) {
          this.sb.append(DQ);
          this.sb.append(sz);
          this.sb.append(DQ);
          this.sb.append(NL);
          return(this);
     }
     public void clear() {
          this.sb.setLength(0);
     }
     public String toString() {
          return(this.sb.toString());
     }
     public String toStringClean() {
          //return( this.sb.toString().replaceAll(CK, EMPTY).replaceAll(NL, "") );
          return( this.sb.toString() );
     }





}

