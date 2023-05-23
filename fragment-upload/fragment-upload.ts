class FragmentUpload{
  private http:any; //接口类

  /**
   * connect server with socketio protocol
   * @param    {File}       file            [上传的文件]
   * @Datetime 2023-05-23T09:20:33+080
   * @Author   Tz
   */
  getfileID(file:File){
    let param = {
      "name": file.name,
      "length": file.size,
      "strongChecksum": '',
      "renameSameFile": true
    }
    this.http.fileInfo(param).subscribe((result) => {
      console.log('fileInfo>>>>>>>>>>>>>>',result)
      if(result.code === 200){
        this.uploadChunk(file, 0, 1, result.data.fileId)
      }else{
        console.log('Error');
      }
    })
  }

  /**
   * connect server with socketio protocol
   * @param    {File}       file            [上传的文件]
   * @param    {number}     start           [开始上传的文件大小位置]
   * @param    {number}     chunkNumber     [当前第几片分片]
   * @param    {string}     fileId          [文件储存ID]
   * @Datetime 2023-05-23T09:20:33+080
   * @Author   Tz
   */
  uploadChunk(file:File, start:number, chunkNumber:number, fileId:string){
    const self = this;
    let chunkSize:number = 20 * 1024 * 1024; // 20M
    let totalChunks = Math.ceil(file.size / chunkSize);
  
    let end = start + chunkSize;
    if(end > file.size){
      end = file.size;
    }
  
    let chunkFile = file.slice(start, end);
  
    let formData = new FormData();
    formData.append('chunkFile', chunkFile);                          // [当前分片文件]
    formData.append('chunkNumber', chunkNumber.toString());           // [当前第几片分片]
    formData.append('chunkSize', chunkSize.toString());               // [分片大小]
    formData.append('currentChunkSize', (end - start).toString());    // [当前分片大小 - 最后一片不一定 = 分片大小]
    formData.append('fileId', fileId);                                // [文件储存ID]
    formData.append('totalChunks', totalChunks.toString());           // [总分片数]
    formData.append('totalSize', file.size.toString());               // [总文件大小]
  
    this.http.fileChunk(formData).subscribe((result) => {
      console.log('fileChunk>>>>>>>>>>>>>>',result)
      if(result.code === 200){
        if(chunkNumber < totalChunks){
          start = chunkNumber * chunkSize;
          self.uploadChunk(file, start, chunkNumber + 1, fileId)      // 递归分片上传
        }else{
          
          // 上传完成
          let param = {
            "fileId": fileId,
          }
          this.http.fileFinish(param).subscribe((result) => {
            console.log('fileFinish>>>>>>>>>>>>>>',result)
            if(result.code === 200){
              console.log('success');
            }else{
              console.log('Error');
            }
          })
        }
      }else{
        console.log('Error');
      }
    })
  }
}